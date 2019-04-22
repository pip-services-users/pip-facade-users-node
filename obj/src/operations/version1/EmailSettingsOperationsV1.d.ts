import { IReferences } from 'pip-services3-commons-node';
import { FacadeOperations } from 'pip-services3-facade-node';
export declare class EmailSettingsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _emailClient;
    constructor();
    setReferences(references: IReferences): void;
    getEmailSettingsOperation(): (req: any, res: any) => void;
    setEmailSettingsOperation(): (req: any, res: any) => void;
    resendVerificationOperation(): (req: any, res: any) => void;
    verifyEmailOperation(): (req: any, res: any) => void;
    private getEmailSettings;
    private setEmailSettings;
    private resendVerification;
    private verifyEmail;
}
