"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_facade_node_1 = require("pip-services-facade-node");
class AccountsOperationsV1 extends pip_services_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services_commons_node_1.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
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
    updateAccountOperation() {
        return (req, res) => {
            this.updateAccount(req, res);
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
        let userId = req.route.params.user_id;
        this._accountsClient.getAccountById(null, userId, this.sendResult(req, res));
    }
    updateAccount(req, res) {
        let userId = req.route.params.user_id;
        let account = req.body;
        account.id = userId;
        this._accountsClient.updateAccount(null, account, this.sendResult(req, res));
    }
}
exports.AccountsOperationsV1 = AccountsOperationsV1;
//# sourceMappingURL=AccountsOperationsV1.js.map