let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { SmsController } from 'pip-services-sms-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { SmsOperationsV1 } from '../../../src/operations/version1/SmsOperationsV1';

suite('SmsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let smsController: SmsController;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'sms', 'default', '1.0'), new SmsOperationsV1())
        smsController = references.getOneRequired<SmsController>(
            new Descriptor('pip-services-sms', 'controller', '*', '*', '1.0')
        );
        smsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should send message', (done) => {
        let message = {
            to: '+79102342354',
            text: 'This is a test message'
        };

        async.series([
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/1.0/sms',
                    message,
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            }
        ], done);
    });

});