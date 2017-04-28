import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class PasswordsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _passwordsClient;
    constructor();
    setReferences(references: IReferences): void;
    recoverPasswordOperation(): (req: any, res: any) => void;
    resetPasswordOperation(): (req: any, res: any) => void;
    changePasswordOperation(): (req: any, res: any) => void;
    private recoverPassword(req, res);
    private resetPassword(req, res);
    private changePassword(req, res);
}
