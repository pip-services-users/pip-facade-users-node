import { IReferences } from 'pip-services3-commons-node';
import { FacadeOperations } from 'pip-services3-facade-node';
export declare class ActivitiesOperationsV1 extends FacadeOperations {
    private _activitiesClient;
    constructor();
    setReferences(references: IReferences): void;
    getActivitiesOperation(): (req: any, res: any) => void;
    getPartyActivitiesOperation(): (req: any, res: any) => void;
    logPartyActivityOperation(): (req: any, res: any) => void;
    private getActivities;
    private getPartyActivities;
    private logPartyActivity;
}
