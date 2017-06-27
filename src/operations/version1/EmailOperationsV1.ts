let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';
import { NotFoundException } from 'pip-services-commons-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';
import { RecipientV1 } from 'pip-clients-email-node';
import { IEmailClientV1 } from 'pip-clients-email-node';

import { FacadeOperations } from 'pip-services-facade-node';

export class EmailOperationsV1  extends FacadeOperations {
    private _accountsClient: IAccountsClientV1;
    private _emailClient: IEmailClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('email', new Descriptor('pip-services-email', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._emailClient = this._dependencyResolver.getOneRequired<IEmailClientV1>('email');
    }

    public sendMessageOperation() {
        return (req, res) => {
            this.sendMessage(req, res);
        }
    }

    private sendMessage(req: any, res: any): void {
        let recipientId = req.param('recipient_id');
        let recipientName = req.param('recipient_name');
        let recipientEmail = req.param('recipient_email');
        let language = req.param('language');
        let parameters = new ConfigParams(this.getFilterParams(req));
        let message = req.body || {};

        if (recipientId != null) {
            let recipient = new RecipientV1(recipientId, recipientName, recipientEmail, language);
            this._emailClient.sendMessageToRecipient(
                null, recipient, null, message, parameters, this.sendEmptyResult(req, res)
            );
        } else {
            this._emailClient.sendMessage(
                null, message, parameters, this.sendEmptyResult(req, res)
            );
        }
    }

}