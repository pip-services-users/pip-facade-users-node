let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { PasswordsController } from 'pip-services-passwords-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { PasswordsOperationsV1 } from '../../../src/operations/version1/PasswordsOperationsV1';

suite('PasswordsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let passwordsController: PasswordsController;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'passwords', 'default', '1.0'), new PasswordsOperationsV1())
        passwordsController = references.getOneRequired<PasswordsController>(
            new Descriptor('pip-services-passwords', 'controller', '*', '*', '1.0')
        );
        passwordsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should reset password', (done) => {
        async.series([
            (callback) => {
                passwordsController.setPassword(null,
                    TestUsers.User1Id, TestUsers.User1Password, callback
                );
            },
            (callback) => {
                rest.post(
                    '/api/1.0/passwords/recover',
                    { 
                        login: TestUsers.User1Login
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.post(
                    '/api/1.0/passwords/reset',
                    { 
                        login: TestUsers.User1Login,
                        code: 'magic',
                        password: 'OIUWEFKHEKJF'
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.postAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/signin',
                    { 
                        login: TestUsers.User1Login,
                        password: 'OIUWEFKHEKJF'
                    },
                    (err, req, res, session) => {
                        assert.isNull(err);

                        assert.isObject(session);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('should change password', (done) => {
        async.series([
            (callback) => {
                passwordsController.setPassword(null,
                    TestUsers.User1Id, TestUsers.User1Password, callback
                );
            },
            (callback) => {
                rest.postAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/passwords/' + TestUsers.User1Id + '/change',
                    {
                        old_password: TestUsers.User1Password,
                        new_password: 'JHWKJHFLDAJSH'
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.postAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/signin',
                    { 
                        login: TestUsers.User1Login,
                        password: 'JHWKJHFLDAJSH'
                    },
                    (err, req, res, session) => {
                        assert.isNull(err);

                        assert.isObject(session);

                        callback();
                    }
                );
            }
        ], done);
    });

});