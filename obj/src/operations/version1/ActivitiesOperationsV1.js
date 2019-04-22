"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_facade_node_1 = require("pip-services3-facade-node");
class ActivitiesOperationsV1 extends pip_services3_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._dependencyResolver.put('activities', new pip_services3_commons_node_1.Descriptor('pip-services-activities', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._activitiesClient = this._dependencyResolver.getOneRequired('activities');
    }
    getActivitiesOperation() {
        return (req, res) => {
            this.getActivities(req, res);
        };
    }
    getPartyActivitiesOperation() {
        return (req, res) => {
            this.getPartyActivities(req, res);
        };
    }
    logPartyActivityOperation() {
        return (req, res) => {
            this.logPartyActivity(req, res);
        };
    }
    getActivities(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        this._activitiesClient.getPartyActivities(null, filter, paging, this.sendResult(req, res));
    }
    getPartyActivities(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let partyId = req.route.params.party_id;
        filter.setAsObject('party_id', partyId);
        this._activitiesClient.getPartyActivities(null, filter, paging, this.sendResult(req, res));
    }
    logPartyActivity(req, res) {
        let activity = req.body;
        this._activitiesClient.logPartyActivity(null, activity, this.sendResult(req, res));
    }
}
exports.ActivitiesOperationsV1 = ActivitiesOperationsV1;
//# sourceMappingURL=ActivitiesOperationsV1.js.map