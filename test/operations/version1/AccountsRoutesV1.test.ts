let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { AccountsOperationsV1 } from '../../../src/operations/version1/AccountsOperationsV1';

suite('AccountsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'accounts', 'default', '1.0'), new AccountsOperationsV1())
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should get the current account', (done) => {
        rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/1.0/accounts/current',
            (err, req, res, account) => {
                assert.isNull(err);

                assert.isObject(account);
                assert.equal(TestUsers.User1Id, account.id);

                done();
            }
        );
    });

    test('should get accounts as admin', (done) => {
        rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/1.0/accounts?paging=1&skip=0&take=2',
            (err, req, res, page) => {
                assert.isNull(err);

                assert.isObject(page);
                assert.lengthOf(page.data, 2);

                done();
            }
        );
    });

    test('should get an account', (done) => {
        rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/1.0/accounts/' + TestUsers.User1Id,
            (err, req, res, account) => {
                assert.isNull(err);
                
                assert.isObject(account);
                assert.equal(TestUsers.User1Id, account.id);

                done();
            }
        );
    });

    test('should update user settings', (done) => {
        let account1: any;

        async.series([
            (callback) => {
                rest.getAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/accounts/' + TestUsers.User1Id,
                    (err, req, res, account) => {
                        assert.isNull(err);
                        
                        assert.isObject(account);
                        assert.equal(TestUsers.User1Id, account.id);

                        account1 = account;

                        callback();
                    }
                );
            },
            (callback) => {
                account1.name = 'New user name';

                rest.putAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/accounts/' + TestUsers.User1Id,
                    account1,
                    (err, req, res, account) => {
                        assert.isNull(err);
                        
                        assert.isObject(account);
                        assert.equal(account.name, 'New user name');

                        callback();
                    }
                );
            }
        ], done);
    });

});