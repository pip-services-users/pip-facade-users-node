import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class SmsSettingsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _smsClient;
    constructor();
    setReferences(references: IReferences): void;
    getSmsSettingsOperation(): (req: any, res: any) => void;
    setSmsSettingsOperation(): (req: any, res: any) => void;
    resendVerificationOperation(): (req: any, res: any) => void;
    verifyPhoneOperation(): (req: any, res: any) => void;
    private getSmsSettings(req, res);
    private setSmsSettings(req, res);
    private resendVerification(req, res);
    private verifyPhone(req, res);
}
