let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';
import { IdGenerator } from 'pip-services-commons-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';
import { IPasswordsClientV1 } from 'pip-clients-passwords-node';
import { IEmailClientV1 } from 'pip-clients-email-node';
import { EmailSettingsV1 } from 'pip-clients-email-node';
import { ISessionsClientV1 } from 'pip-clients-sessions-node';

import { FacadeOperations } from 'pip-services-facade-node';

export class AccountsOperationsV1  extends FacadeOperations {
    private _accountsClient: IAccountsClientV1;
    private _passwordsClient: IPasswordsClientV1;
    private _emailClient: IEmailClientV1;
    private _sessionsClient: ISessionsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('email', new Descriptor('pip-services-email', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired<IPasswordsClientV1>('passwords');
        this._emailClient = this._dependencyResolver.getOneOptional<IEmailClientV1>('email');
        this._sessionsClient = this._dependencyResolver.getOneRequired<ISessionsClientV1>('sessions');
    }

    public getAccountsOperation() {
        return (req, res) => {
            this.getAccounts(req, res);
        }
    }

    public getCurrentAccountOperation() {
        return (req, res) => {
            this.getCurrentAccount(req, res);
        }
    }

    public getAccountOperation() {
        return (req, res) => {
            this.getAccount(req, res);
        }
    }

    public createAccountOperation() {
        return (req, res) => {
            this.createAccount(req, res);
        }
    }

    public updateAccountOperation() {
        return (req, res) => {
            this.updateAccount(req, res);
        }
    }

    public deleteAccountOperation() {
        return (req, res) => {
            this.deleteAccount(req, res);
        }
    }

    private getAccounts(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        this._accountsClient.getAccounts(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    private getCurrentAccount(req: any, res: any): void {
        this._accountsClient.getAccountById(
            null, req.user_id, this.sendResult(req, res)
        );
    }

    private getAccount(req: any, res: any): void {
        let userId = req.route.params.account_id || req.route.params.user_id;

        this._accountsClient.getAccountById(
            null, userId, this.sendResult(req, res)
        );
    }

    private createAccount(req: any, res: any): void {
        let data = req.body;
        let account: AccountV1 = null;
        let password = data.password;
        
        async.series([
            // Create account
            (callback) => {
                let newAccount = <AccountV1>{
                    name: data.name,
                    login: data.login || data.email, // Use email as login by default
                    language: data.language,
                    theme: data.theme,
                    time_zone: data.time_zone
                };

                this._accountsClient.createAccount(
                    null, newAccount, 
                    (err, data) => {
                        account = data;
                        callback(err);
                    }
                )
            },
            // Create password for the account
            (callback) => {
                if (password != null) {
                    // Use provided password
                    this._passwordsClient.setPassword(
                        null, account.id, password, callback
                    );
                } else {
                    // Set temporary password
                    this._passwordsClient.setTempPassword(
                        null, account.id, (err, data) => {
                            password = data;
                            callback(err);
                        }
                    )
                }
            },
            // Create email settings for the account
            (callback) => {
                let email = data.email;
                let newEmailSettings = new EmailSettingsV1(
                    account.id, account.name, email, account.language
                );

                if (this._emailClient != null) {
                    this._emailClient.setSettings(
                        null, newEmailSettings, callback
                    );
                } else callback();
            }
        ], (err) => {
            if (err) 
                this.sendError(req, res, err);
            else {
                if (account != null)
                    (<any>account).password = password;

                res.json(account);
            }
        });
    }

    private updateAccount(req: any, res: any): void {
        let userId = req.route.params.account_id || req.route.params.user_id;
        let account = req.body;
        account.id = userId;
        let newAccount: AccountV1;

        async.series([
            // Update account
            (callback) => {
                this._accountsClient.updateAccount(
                    null, account, (err, data) => {
                        newAccount = data;
                        callback(err);
                    }
                );
            },
            // Update session data
            (callback) => {
                if (newAccount && req.session_id && req.user
                    && this._sessionsClient && req.user.id == newAccount.id) {
                    let data = _.assign(req.user, newAccount);
                    this._sessionsClient.storeSessionData(null, req.session_id, data, callback);
                } else callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else if (newAccount == null)
                res.json(204);
            else 
                res.json(newAccount);
        });
    }

    private deleteAccount(req: any, res: any): void {
        let userId = req.route.params.account_id || req.route.params.user_id;

        this._accountsClient.deleteAccountById(
            null, userId, this.sendResult(req, res)
        );
    }
}