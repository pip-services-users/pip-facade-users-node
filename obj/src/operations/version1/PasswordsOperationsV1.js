"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_facade_node_1 = require("pip-services3-facade-node");
class PasswordsOperationsV1 extends pip_services3_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services3_commons_node_1.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services3_commons_node_1.Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
    }
    recoverPasswordOperation() {
        return (req, res) => {
            this.recoverPassword(req, res);
        };
    }
    resetPasswordOperation() {
        return (req, res) => {
            this.resetPassword(req, res);
        };
    }
    changePasswordOperation() {
        return (req, res) => {
            this.changePassword(req, res);
        };
    }
    recoverPassword(req, res) {
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
                this._passwordsClient.recoverPassword(null, account.id, callback);
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
    resetPassword(req, res) {
        let login = req.param('login');
        let code = req.param('code');
        let password = req.param('password');
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
                this._passwordsClient.resetPassword(null, account.id, code, password, callback);
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
    changePassword(req, res) {
        let userId = req.route.params.user_id;
        let oldPassword = req.param('old_password');
        let newPassword = req.param('new_password');
        this._passwordsClient.changePassword(null, userId, oldPassword, newPassword, (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(204);
        });
    }
}
exports.PasswordsOperationsV1 = PasswordsOperationsV1;
//# sourceMappingURL=PasswordsOperationsV1.js.map