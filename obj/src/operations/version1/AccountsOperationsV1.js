"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_clients_email_node_1 = require("pip-clients-email-node");
const pip_services_facade_node_1 = require("pip-services-facade-node");
class AccountsOperationsV1 extends pip_services_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services_commons_node_1.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services_commons_node_1.Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('email', new pip_services_commons_node_1.Descriptor('pip-services-email', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
        this._emailClient = this._dependencyResolver.getOneOptional('email');
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
                let newEmailSettings = new pip_clients_email_node_1.EmailSettingsV1(account.id, account.name, email, account.language);
                if (this._emailClient != null) {
                    this._emailClient.setSettings(null, newEmailSettings, callback);
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
        this._accountsClient.updateAccount(null, account, this.sendResult(req, res));
    }
    deleteAccount(req, res) {
        let userId = req.route.params.account_id || req.route.params.user_id;
        this._accountsClient.deleteAccountById(null, userId, this.sendResult(req, res));
    }
}
exports.AccountsOperationsV1 = AccountsOperationsV1;
//# sourceMappingURL=AccountsOperationsV1.js.map