import { IReferences } from 'pip-services3-commons-node';
import { FacadeOperations } from 'pip-services3-facade-node';
export declare class AccountsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _passwordsClient;
    private _emailSettingsClient;
    private _smsSettingsClient;
    private _sessionsClient;
    constructor();
    setReferences(references: IReferences): void;
    getAccountsOperation(): (req: any, res: any) => void;
    getCurrentAccountOperation(): (req: any, res: any) => void;
    getAccountOperation(): (req: any, res: any) => void;
    createAccountOperation(): (req: any, res: any) => void;
    updateAccountOperation(): (req: any, res: any) => void;
    deleteAccountOperation(): (req: any, res: any) => void;
    private getAccounts(req, res);
    private getCurrentAccount(req, res);
    private getAccount(req, res);
    private createAccount(req, res);
    private updateAccount(req, res);
    private deleteAccount(req, res);
}
