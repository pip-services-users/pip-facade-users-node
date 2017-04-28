import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class EmailSettingsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _emailClient;
    constructor();
    setReferences(references: IReferences): void;
    getEmailSettingsOperation(): (req: any, res: any) => void;
    setEmailSettingsOperation(): (req: any, res: any) => void;
    resendVerificationOperation(): (req: any, res: any) => void;
    verifyEmailOperation(): (req: any, res: any) => void;
    private getEmailSettings(req, res);
    private setEmailSettings(req, res);
    private resendVerification(req, res);
    private verifyEmail(req, res);
}
