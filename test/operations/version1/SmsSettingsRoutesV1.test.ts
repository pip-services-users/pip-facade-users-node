let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { SmsController } from 'pip-services-sms-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { SmsSettingsOperationsV1 } from '../../../src/operations/version1/SmsSettingsOperationsV1';

suite('SmsSettingsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let smsSettingsController: SmsController;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'sms-settings', 'default', '1.0'), new SmsSettingsOperationsV1())
        smsSettingsController = references.getOneRequired<SmsController>(
            new Descriptor('pip-services-sms', 'controller', '*', '*', '1.0')
        );
        smsSettingsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should verify sms', (done) => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            phone: '+79102347439'
        };

        async.series([
            (callback) => {
                rest.putAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/sms_settings/' + TestUsers.User1Id,
                    settings,
                    (err, req, res, settings) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.post(
                    '/api/1.0/sms_settings/resend',
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
                    '/api/1.0/sms_settings/verify',
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

    test('should get and set sms settings', (done) => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            phone: '+79102347439'
        };

        async.series([
            (callback) => {
                rest.putAsUser(
                    TestUsers.User1SessionId,
                    '/api/1.0/sms_settings/' + TestUsers.User1Id,
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
                    '/api/1.0/sms_settings/' + TestUsers.User1Id,
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