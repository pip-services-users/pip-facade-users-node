let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';

import { IRolesClientV1 } from 'pip-clients-roles-node';

import { FacadeOperations } from 'pip-services-facade-node';

export class RolesOperationsV1  extends FacadeOperations {
    private _rolesClient: IRolesClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('roles', new Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._rolesClient = this._dependencyResolver.getOneRequired<IRolesClientV1>('roles');
    }

    public getUserRolesOperation() {
        return (req, res) => {
            this.getUserRoles(req, res);
        }
    }

    public grantUserRolesOperation() {
        return (req, res) => {
            this.grantUserRoles(req, res);
        }
    }

    public revokeUserRolesOperation() {
        return (req, res) => {
            this.revokeUserRoles(req, res);
        }
    }

    private getUserRoles(req: any, res: any): void {
        let userId = req.route.params.user_id;

        this._rolesClient.getRoles(
            null, userId, this.sendResult(req, res)
        );
    }

    private grantUserRoles(req: any, res: any): void {
        let userId = req.route.params.user_id;
        let roles = req.body;

        this._rolesClient.grantRoles(
            null, userId, roles, this.sendResult(req, res)
        );
    }

    private revokeUserRoles(req: any, res: any): void {
        let userId = req.route.params.user_id;
        let roles = req.body;

        this._rolesClient.revokeRoles(
            null, userId, roles, this.sendResult(req, res)
        );
    }

}