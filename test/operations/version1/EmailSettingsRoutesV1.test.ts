let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { EmailController } from 'pip-services-email-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { EmailSettingsOperationsV1 } from '../../../src/operations/version1/EmailSettingsOperationsV1';

suite('EmailSettingsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let emailSettingsController: EmailController;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'email-settings', 'default', '1.0'), new EmailSettingsOperationsV1())
        emailSettingsController = references.getOneRequired<EmailController>(
            new Descriptor('pip-services-email', 'controller', '*', '*', '1.0')
        );
        emailSettingsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should verify email', (done) => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            email: 'test1@somewhere.com'
        };

        async.series([
            (callback) => {
                rest.putAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/email_settings/' + TestUsers.User1Id,
                    settings,
                    (err, req, res, settings) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.post(
                    '/api/1.0/email_settings/resend',
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
                    '/api/1.0/email_settings/verify',
                    { 
                        login: TestUsers.User1Login,
                        code: 'magic'
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('should get and set email settings', (done) => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            email: 'test1@somewhere.com'
        };

        async.series([
            (callback) => {
                rest.putAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/email_settings/' + TestUsers.User1Id,
                    settings,
                    (err, req, res, settings) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.getAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/email_settings/' + TestUsers.User1Id,
                    (err, req, res, settings) => {
                        assert.isNull(err);

                        assert.isObject(settings);

                        callback();
                    }
                );
            }
        ], done);
    });

});