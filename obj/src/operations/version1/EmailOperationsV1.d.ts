import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class EmailOperationsV1 extends FacadeOperations {
    private _accountsClient;
    private _emailClient;
    constructor();
    setReferences(references: IReferences): void;
    sendMessageOperation(): (req: any, res: any) => void;
    private sendMessage(req, res);
}
