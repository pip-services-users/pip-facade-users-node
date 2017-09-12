"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
const pip_services_facade_node_1 = require("pip-services-facade-node");
class SmsOperationsV1 extends pip_services_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services_commons_node_2.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sms', new pip_services_commons_node_2.Descriptor('pip-services-sms', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._smsClient = this._dependencyResolver.getOneRequired('sms');
    }
    sendMessageOperation() {
        return (req, res) => {
            this.sendMessage(req, res);
        };
    }
    sendMessage(req, res) {
        let recipientId = req.param('recipient_id');
        let recipientName = req.param('recipient_name');
        let recipientPhone = req.param('recipient_phone');
        let language = req.param('language');
        let parameters = new pip_services_commons_node_1.ConfigParams(this.getFilterParams(req));
        let message = req.body || {};
        if (recipientId != null) {
            let recipient = new pip_clients_sms_node_1.SmsRecipientV1(recipientId, recipientName, recipientPhone, language);
            this._smsClient.sendMessageToRecipient(null, recipient, null, message, parameters, this.sendEmptyResult(req, res));
        }
        else {
            this._smsClient.sendMessage(null, message, parameters, this.sendEmptyResult(req, res));
        }
    }
}
exports.SmsOperationsV1 = SmsOperationsV1;
//# sourceMappingURL=SmsOperationsV1.js.map