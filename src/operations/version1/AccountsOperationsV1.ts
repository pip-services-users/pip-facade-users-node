let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';

import { FacadeOperations } from 'pip-services-facade-node';

export class AccountsOperationsV1  extends FacadeOperations {
    private _accountsClient: IAccountsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
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
        let account = req.body;

        this._accountsClient.createAccount(
            null, account, this.sendResult(req, res)
        );
    }

    private updateAccount(req: any, res: any): void {
        let userId = req.route.params.account_id || req.route.params.user_id;
        let account = req.body;
        account.id = userId;

        this._accountsClient.updateAccount(
            null, account, this.sendResult(req, res)
        );
    }

    private deleteAccount(req: any, res: any): void {
        let userId = req.route.params.account_id || req.route.params.user_id;

        this._accountsClient.deleteAccountById(
            null, userId, this.sendResult(req, res)
        );
    }
}