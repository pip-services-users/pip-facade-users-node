import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class RolesOperationsV1 extends FacadeOperations {
    private _rolesClient;
    constructor();
    setReferences(references: IReferences): void;
    getUserRolesOperation(): (req: any, res: any) => void;
    grantUserRolesOperation(): (req: any, res: any) => void;
    revokeUserRolesOperation(): (req: any, res: any) => void;
    private getUserRoles(req, res);
    private grantUserRoles(req, res);
    private revokeUserRoles(req, res);
}
