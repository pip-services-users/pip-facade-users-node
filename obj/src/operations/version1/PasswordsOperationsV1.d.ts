import { IReferences } from 'pip-services3-commons-node';
import { FacadeOperations } from 'pip-services3-facade-node';
export declare class PasswordsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _passwordsClient;
    constructor();
    setReferences(references: IReferences): void;
    recoverPasswordOperation(): (req: any, res: any) => void;
    resetPasswordOperation(): (req: any, res: any) => void;
    changePasswordOperation(): (req: any, res: any) => void;
    private recoverPassword;
    private resetPassword;
    private changePassword;
}
