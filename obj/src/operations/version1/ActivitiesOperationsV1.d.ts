import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class ActivitiesOperationsV1 extends FacadeOperations {
    private _activitiesClient;
    constructor();
    setReferences(references: IReferences): void;
    getActivitiesOperation(): (req: any, res: any) => void;
    getPartyActivitiesOperation(): (req: any, res: any) => void;
    logPartyActivityOperation(): (req: any, res: any) => void;
    private getActivities(req, res);
    private getPartyActivities(req, res);
    private logPartyActivity(req, res);
}
