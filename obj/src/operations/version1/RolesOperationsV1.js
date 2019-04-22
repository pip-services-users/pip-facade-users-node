"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_facade_node_1 = require("pip-services3-facade-node");
class RolesOperationsV1 extends pip_services3_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('roles', new pip_services3_commons_node_1.Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._rolesClient = this._dependencyResolver.getOneRequired('roles');
    }
    getUserRolesOperation() {
        return (req, res) => {
            this.getUserRoles(req, res);
        };
    }
    grantUserRolesOperation() {
        return (req, res) => {
            this.grantUserRoles(req, res);
        };
    }
    revokeUserRolesOperation() {
        return (req, res) => {
            this.revokeUserRoles(req, res);
        };
    }
    getUserRoles(req, res) {
        let userId = req.route.params.user_id;
        this._rolesClient.getRolesById(null, userId, this.sendResult(req, res));
    }
    grantUserRoles(req, res) {
        let userId = req.route.params.user_id;
        let roles = req.body;
        this._rolesClient.grantRoles(null, userId, roles, this.sendResult(req, res));
    }
    revokeUserRoles(req, res) {
        let userId = req.route.params.user_id;
        let roles = req.body;
        this._rolesClient.revokeRoles(null, userId, roles, this.sendResult(req, res));
    }
}
exports.RolesOperationsV1 = RolesOperationsV1;
//# sourceMappingURL=RolesOperationsV1.js.map