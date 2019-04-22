"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_facade_node_1 = require("pip-services3-facade-node");
class SmsSettingsOperationsV1 extends pip_services3_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services3_commons_node_1.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new pip_services3_commons_node_1.Descriptor('pip-services-smssettings', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._smsClient = this._dependencyResolver.getOneRequired('smssettings');
    }
    getSmsSettingsOperation() {
        return (req, res) => {
            this.getSmsSettings(req, res);
        };
    }
    setSmsSettingsOperation() {
        return (req, res) => {
            this.setSmsSettings(req, res);
        };
    }
    resendVerificationOperation() {
        return (req, res) => {
            this.resendVerification(req, res);
        };
    }
    verifyPhoneOperation() {
        return (req, res) => {
            this.verifyPhone(req, res);
        };
    }
    getSmsSettings(req, res) {
        let userId = req.route.params.user_id;
        this._smsClient.getSettingsById(null, userId, this.sendResult(req, res));
    }
    setSmsSettings(req, res) {
        let userId = req.route.params.user_id;
        let settings = req.body || {};
        settings.id = userId;
        this._smsClient.setSettings(null, settings, this.sendResult(req, res));
    }
    resendVerification(req, res) {
        let login = req.param('login');
        let account;
        async.series([
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                    }
                    account = data;
                    callback(err);
                });
            },
            (callback) => {
                this._smsClient.resendVerification(null, account.id, callback);
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
    verifyPhone(req, res) {
        let login = req.param('login');
        let code = req.param('code');
        let account;
        async.series([
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                    }
                    account = data;
                    callback(err);
                });
            },
            (callback) => {
                this._smsClient.verifyPhone(null, account.id, code, callback);
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
}
exports.SmsSettingsOperationsV1 = SmsSettingsOperationsV1;
//# sourceMappingURL=SmsSettingsOperationsV1.js.map