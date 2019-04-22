let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { ActivitiesOperationsV1 } from '../../../src/operations/version1/ActivitiesOperationsV1';

suite('ActivitiesOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'activities', 'default', '1.0'), new ActivitiesOperationsV1())
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should get activities as admin', (done) => {
        rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/1.0/activities?paging=1&skip=0&take=2',
            (err, req, res, page) => {
                assert.isNull(err);

                assert.isObject(page);

                done();
            }
        );
    });

    test('should get party activities as owner', (done) => {
        rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/1.0/activities/' + TestUsers.User1SessionId + '?paging=1&skip=0&take=2',
            (err, req, res, page) => {
                assert.isNull(err);

                assert.isObject(page);

                done();
            }
        );
    });

});