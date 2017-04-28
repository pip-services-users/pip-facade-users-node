"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_facade_node_1 = require("pip-services-facade-node");
class EmailSettingsOperationsV1 extends pip_services_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services_commons_node_1.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('email', new pip_services_commons_node_1.Descriptor('pip-services-email', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._emailClient = this._dependencyResolver.getOneRequired('email');
    }
    getEmailSettingsOperation() {
        return (req, res) => {
            this.getEmailSettings(req, res);
        };
    }
    setEmailSettingsOperation() {
        return (req, res) => {
            this.setEmailSettings(req, res);
        };
    }
    resendVerificationOperation() {
        return (req, res) => {
            this.resendVerification(req, res);
        };
    }
    verifyEmailOperation() {
        return (req, res) => {
            this.verifyEmail(req, res);
        };
    }
    getEmailSettings(req, res) {
        let userId = req.route.params.user_id;
        this._emailClient.getSettingsById(null, userId, this.sendResult(req, res));
    }
    setEmailSettings(req, res) {
        let userId = req.route.params.user_id;
        let settings = req.body || {};
        settings.id = userId;
        this._emailClient.setSettings(null, settings, this.sendResult(req, res));
    }
    resendVerification(req, res) {
        let login = req.param('login');
        let account;
        async.series([
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services_commons_node_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                    }
                    account = data;
                    callback(err);
                });
            },
            (callback) => {
                this._emailClient.resendVerification(null, account.id, callback);
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
    verifyEmail(req, res) {
        let login = req.param('login');
        let code = req.param('code');
        let account;
        async.series([
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services_commons_node_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                    }
                    account = data;
                    callback(err);
                });
            },
            (callback) => {
                this._emailClient.verifyEmail(null, account.id, code, callback);
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
}
exports.EmailSettingsOperationsV1 = EmailSettingsOperationsV1;
//# sourceMappingURL=EmailSettingsOperationsV1.js.map