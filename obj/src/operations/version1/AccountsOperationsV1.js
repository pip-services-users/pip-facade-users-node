"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_facade_node_1 = require("pip-services3-facade-node");
class AccountsOperationsV1 extends pip_services3_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services3_commons_node_1.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services3_commons_node_1.Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new pip_services3_commons_node_1.Descriptor('pip-services-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new pip_services3_commons_node_1.Descriptor('pip-services-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new pip_services3_commons_node_1.Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional('smssettings');
        this._sessionsClient = this._dependencyResolver.getOneRequired('sessions');
    }
    getAccountsOperation() {
        return (req, res) => {
            this.getAccounts(req, res);
        };
    }
    getCurrentAccountOperation() {
        return (req, res) => {
            this.getCurrentAccount(req, res);
        };
    }
    getAccountOperation() {
        return (req, res) => {
            this.getAccount(req, res);
        };
    }
    createAccountOperation() {
        return (req, res) => {
            this.createAccount(req, res);
        };
    }
    updateAccountOperation() {
        return (req, res) => {
            this.updateAccount(req, res);
        };
    }
    deleteAccountOperation() {
        return (req, res) => {
            this.deleteAccount(req, res);
        };
    }
    getAccounts(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        this._accountsClient.getAccounts(null, filter, paging, this.sendResult(req, res));
    }
    getCurrentAccount(req, res) {
        this._accountsClient.getAccountById(null, req.user_id, this.sendResult(req, res));
    }
    getAccount(req, res) {
        let userId = req.route.params.account_id || req.route.params.user_id;
        this._accountsClient.getAccountById(null, userId, this.sendResult(req, res));
    }
    createAccount(req, res) {
        let data = req.body;
        let account = null;
        let password = data.password;
        async.series([
            // Create account
            (callback) => {
                let newAccount = {
                    name: data.name,
                    login: data.login || data.email,
                    language: data.language,
                    theme: data.theme,
                    time_zone: data.time_zone
                };
                this._accountsClient.createAccount(null, newAccount, (err, data) => {
                    account = data;
                    callback(err);
                });
            },
            // Create password for the account
            (callback) => {
                if (password != null) {
                    // Use provided password
                    this._passwordsClient.setPassword(null, account.id, password, callback);
                }
                else {
                    // Set temporary password
                    this._passwordsClient.setTempPassword(null, account.id, (err, data) => {
                        password = data;
                        callback(err);
                    });
                }
            },
            // Create email settings for the account
            (callback) => {
                let email = data.email;
                let newEmailSettings = {
                    id: account.id,
                    name: account.name,
                    email: email,
                    language: account.language
                };
                if (this._emailSettingsClient != null) {
                    this._emailSettingsClient.setSettings(null, newEmailSettings, callback);
                }
                else
                    callback();
            },
            // Create sms settings for the account
            (callback) => {
                let phone = data.phone;
                let newSmsSettings = {
                    id: account.id,
                    name: account.name,
                    phone: phone,
                    language: account.language
                };
                if (phone != null && this._smsSettingsClient != null) {
                    this._smsSettingsClient.setSettings(null, newSmsSettings, callback);
                }
                else
                    callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else {
                if (account != null)
                    account.password = password;
                res.json(account);
            }
        });
    }
    updateAccount(req, res) {
        let userId = req.route.params.account_id || req.route.params.user_id;
        let account = req.body;
        account.id = userId;
        let newAccount;
        async.series([
            // Update account
            (callback) => {
                this._accountsClient.updateAccount(null, account, (err, data) => {
                    newAccount = data;
                    callback(err);
                });
            },
            // Update session data
            (callback) => {
                if (newAccount && req.session_id && req.user
                    && this._sessionsClient && req.user.id == newAccount.id) {
                    let user = _.assign(req.user, newAccount);
                    this._sessionsClient.updateSessionUser(null, req.session_id, user, callback);
                }
                else
                    callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else if (newAccount == null)
                res.json(204);
            else
                res.json(newAccount);
        });
    }
    deleteAccount(req, res) {
        let userId = req.route.params.account_id || req.route.params.user_id;
        this._accountsClient.deleteAccountById(null, userId, this.sendResult(req, res));
    }
}
exports.AccountsOperationsV1 = AccountsOperationsV1;
//# sourceMappingURL=AccountsOperationsV1.js.map