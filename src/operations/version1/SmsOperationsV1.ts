let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';
import { NotFoundException } from 'pip-services-commons-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';
import { RecipientV1 } from 'pip-clients-sms-node';
import { ISmsClientV1 } from 'pip-clients-sms-node';

import { FacadeOperations } from 'pip-services-facade-node';

export class SmsOperationsV1  extends FacadeOperations {
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

    public sendMessageOperation() {
        return (req, res) => {
            this.sendMessage(req, res);
        }
    }

    private sendMessage(req: any, res: any): void {
        let recipientId = req.param('recipient_id');
        let recipientName = req.param('recipient_name');
        let recipientSms = req.param('recipient_sms');
        let language = req.param('language');
        let parameters = new ConfigParams(this.getFilterParams(req));
        let message = req.body || {};

        if (recipientId != null) {
            let recipient = new RecipientV1(recipientId, recipientName, recipientSms, language);
            this._smsClient.sendMessageToRecipient(
                null, recipient, null, message, parameters, this.sendEmptyResult(req, res)
            );
        } else {
            this._smsClient.sendMessage(
                null, message, parameters, this.sendEmptyResult(req, res)
            );
        }
    }

}