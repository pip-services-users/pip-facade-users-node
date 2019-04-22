import { IReferences } from 'pip-services3-commons-node';
import { FacadeOperations } from 'pip-services3-facade-node';
export declare class SmsSettingsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _smsClient;
    constructor();
    setReferences(references: IReferences): void;
    getSmsSettingsOperation(): (req: any, res: any) => void;
    setSmsSettingsOperation(): (req: any, res: any) => void;
    resendVerificationOperation(): (req: any, res: any) => void;
    verifyPhoneOperation(): (req: any, res: any) => void;
    private getSmsSettings;
    private setSmsSettings;
    private resendVerification;
    private verifyPhone;
}
