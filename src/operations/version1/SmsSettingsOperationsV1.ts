let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';
import { NotFoundException } from 'pip-services-commons-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';
import { ISmsClientV1 } from 'pip-clients-sms-node';

import { FacadeOperations } from 'pip-services-facade-node';

export class SmsSettingsOperationsV1  extends FacadeOperations {
    private _accountsClient: IAccountsClientV1;
    private _smsClient: ISmsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sms', new Descriptor('pip-services-sms', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._smsClient = this._dependencyResolver.getOneRequired<ISmsClientV1>('sms');
    }

    public getSmsSettingsOperation() {
        return (req, res) => {
            this.getSmsSettings(req, res);
        }
    }

    public setSmsSettingsOperation() {
        return (req, res) => {
            this.setSmsSettings(req, res);
        }
    }

    public resendVerificationOperation() {
        return (req, res) => {
            this.resendVerification(req, res);
        }
    }

    public verifyPhoneOperation() {
        return (req, res) => {
            this.verifyPhone(req, res);
        }
    }

    private getSmsSettings(req: any, res: any): void {
        let userId = req.route.params.user_id;

        this._smsClient.getSettingsById(
            null, userId, this.sendResult(req, res)
        );
    }

    private setSmsSettings(req: any, res: any): void {
        let userId = req.route.params.user_id;
        let settings = req.body || {};
        settings.id = userId;

        this._smsClient.setSettings(
            null, settings, this.sendResult(req, res)
        );
    }

    private resendVerification(req: any, res: any): void {
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
                this._smsClient.resendVerification(
                    null, account.id, callback
                );
            }
        ], (err) => {
            if (err) this.sendError(req, res, err);
            else res.json(204);
        });
    }

    private verifyPhone(req: any, res: any): void {
        let login = req.param('login');
        let code = req.param('code');
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
                this._smsClient.verifyPhone(
                    null, account.id, code, callback
                );
            }
        ], (err) => {
            if (err) this.sendError(req, res, err);
            else res.json(204);
        });
    }

}