let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node'; 
import { DependencyResolver } from 'pip-services3-commons-node';

import { IActivitiesClientV1 } from 'pip-clients-activities-node';

import { FacadeOperations } from 'pip-services3-facade-node';

export class ActivitiesOperationsV1  extends FacadeOperations {
    private _activitiesClient: IActivitiesClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('activities', new Descriptor('pip-services-activities', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._activitiesClient = this._dependencyResolver.getOneRequired<IActivitiesClientV1>('activities');
    }

    public getActivitiesOperation() {
        return (req, res) => {
            this.getActivities(req, res);
        }
    }

    public getPartyActivitiesOperation() {
        return (req, res) => {
            this.getPartyActivities(req, res);
        }
    }

    public logPartyActivityOperation() {
        return (req, res) => {
            this.logPartyActivity(req, res);
        }
    }

    private getActivities(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        this._activitiesClient.getPartyActivities(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    private getPartyActivities(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let partyId = req.route.params.party_id;
        filter.setAsObject('party_id', partyId);

        this._activitiesClient.getPartyActivities(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    private logPartyActivity(req: any, res: any): void {
        let activity = req.body;

        this._activitiesClient.logPartyActivity(
            null, activity, this.sendResult(req, res)
        );
    }

}