let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node'; 
import { DependencyResolver } from 'pip-services3-commons-node';
import { NotFoundException } from 'pip-services3-commons-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';
import { IPasswordsClientV1 } from 'pip-clients-passwords-node';

import { FacadeOperations } from 'pip-services3-facade-node';

export class PasswordsOperationsV1  extends FacadeOperations {
    private _accountsClient: IAccountsClientV1;
    private _passwordsClient: IPasswordsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired<IPasswordsClientV1>('passwords');
    }

    public recoverPasswordOperation() {
        return (req, res) => {
            this.recoverPassword(req, res);
        }
    }

    public resetPasswordOperation() {
        return (req, res) => {
            this.resetPassword(req, res);
        }
    }

    public changePasswordOperation() {
        return (req, res) => {
            this.changePassword(req, res);
        }
    }

    private recoverPassword(req: any, res: any): void {
        let login = req.param('login');
        let account: AccountV1;

        async.series([
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(
                    null, login, (err, data) => {
                        if (err == null && data == null) {
                            err = new NotFoundException(
                                null,
                                'LOGIN_NOT_FOUND',
                                'Login ' + login + ' was not found'
                            ).withDetails('login', login);
                        }
                        account = data;
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._passwordsClient.recoverPassword(
                    null, account.id, callback
                );
            }
        ], (err) => {
            if (err) this.sendError(req, res, err);
            else res.json(204);
        });
    }

    private resetPassword(req: any, res: any): void {
        let login = req.param('login');
        let code = req.param('code');
        let password = req.param('password');
        let account: AccountV1;

        async.series([
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(
                    null, login, (err, data) => {
                        if (err == null && data == null) {
                            err = new NotFoundException(
                                null,
                                'LOGIN_NOT_FOUND',
                                'Login ' + login + ' was not found'
                            ).withDetails('login', login);
                        }
                        account = data;
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._passwordsClient.resetPassword(
                    null, account.id, code, password, callback
                );
            }
        ], (err) => {
            if (err) this.sendError(req, res, err);
            else res.json(204);
        });
    }

    private changePassword(req: any, res: any): void {
        let userId = req.route.params.user_id;
        let oldPassword = req.param('old_password');
        let newPassword = req.param('new_password');

        this._passwordsClient.changePassword(
            null, userId, oldPassword, newPassword, (err) => {
                if (err) this.sendError(req, res, err);
                else res.json(204);
            }
        );
    }

}