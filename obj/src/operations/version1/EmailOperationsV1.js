"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_clients_email_node_1 = require("pip-clients-email-node");
const pip_services_facade_node_1 = require("pip-services-facade-node");
class EmailOperationsV1 extends pip_services_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services_commons_node_2.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('email', new pip_services_commons_node_2.Descriptor('pip-services-email', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._emailClient = this._dependencyResolver.getOneRequired('email');
    }
    sendMessageOperation() {
        return (req, res) => {
            this.sendMessage(req, res);
        };
    }
    sendMessage(req, res) {
        let recipientId = req.param('recipient_id');
        let recipientName = req.param('recipient_name');
        let recipientEmail = req.param('recipient_email');
        let language = req.param('language');
        let parameters = new pip_services_commons_node_1.ConfigParams(this.getFilterParams(req));
        let message = req.body || {};
        if (recipientId != null) {
            let recipient = new pip_clients_email_node_1.EmailRecipientV1(recipientId, recipientName, recipientEmail, language);
            this._emailClient.sendMessageToRecipient(null, recipient, null, message, parameters, this.sendEmptyResult(req, res));
        }
        else {
            this._emailClient.sendMessage(null, message, parameters, this.sendEmptyResult(req, res));
        }
    }
}
exports.EmailOperationsV1 = EmailOperationsV1;
//# sourceMappingURL=EmailOperationsV1.js.map