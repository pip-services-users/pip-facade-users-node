import { IReferences } from 'pip-services3-commons-node';
import { FacadeOperations } from 'pip-services3-facade-node';
export declare class RolesOperationsV1 extends FacadeOperations {
    private _rolesClient;
    constructor();
    setReferences(references: IReferences): void;
    getUserRolesOperation(): (req: any, res: any) => void;
    grantUserRolesOperation(): (req: any, res: any) => void;
    revokeUserRolesOperation(): (req: any, res: any) => void;
    private getUserRoles;
    private grantUserRoles;
    private revokeUserRoles;
}
