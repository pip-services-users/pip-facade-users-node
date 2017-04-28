let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { RolesOperationsV1 } from '../../../src/operations/version1/RolesOperationsV1';

suite('RolesOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'roles', 'default', '1.0'), new RolesOperationsV1())
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should read roles as user', (done) => {
        async.series([
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/1.0/roles/' + TestUsers.User1Id + '/grant',
                    ['paid'],
                    (err, req, res, roles) => {
                        assert.isNull(err);

                        assert.isArray(roles);
                        assert.sameMembers(['paid'], roles);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.getAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/roles/' + TestUsers.User1Id,
                    (err, req, res, roles) => {
                        assert.isNull(err);

                        assert.isArray(roles);
                        assert.sameMembers(['paid'], roles);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('should grant and revoke roles as admin', (done) => {
        async.series([
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/1.0/roles/' + TestUsers.User1Id + '/grant',
                    ['paid'],
                    (err, req, res, roles) => {
                        assert.isNull(err);

                        assert.isArray(roles);
                        assert.sameMembers(['paid'], roles);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/1.0/roles/' + TestUsers.User1Id + '/revoke',
                    ['paid'],
                    (err, req, res, roles) => {
                        assert.isNull(err);

                        assert.isArray(roles);
                        assert.lengthOf(roles, 0);

                        callback();
                    }
                );
            }
        ], done);
    });

});