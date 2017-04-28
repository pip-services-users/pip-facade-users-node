import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class AccountsOperationsV1 extends FacadeOperations {
    private _accountsClient;
    constructor();
    setReferences(references: IReferences): void;
    getAccountsOperation(): (req: any, res: any) => void;
    getCurrentAccountOperation(): (req: any, res: any) => void;
    getAccountOperation(): (req: any, res: any) => void;
    updateAccountOperation(): (req: any, res: any) => void;
    private getAccounts(req, res);
    private getCurrentAccount(req, res);
    private getAccount(req, res);
    private updateAccount(req, res);
}