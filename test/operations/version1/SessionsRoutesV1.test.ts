let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';

suite('SessionOperationsV1', () => {
    let USER = {
        login: 'test',
        name: 'Test User',
        email: 'test@conceptual.vision',
        password: 'test123'
    };

    let references: TestReferences;
    let rest: TestRestClient;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should signup new user', (done) => {
        rest.post('/api/1.0/signup',
            USER,
            (err, req, res, session) => {
                assert.isNull(err);

                assert.isDefined(session);
                assert.isDefined(session.id);
                assert.equal(session.user_name, USER.name);

                done();
            }
        );
    });

    test('should check login for signup', (done) => {
        async.series([
        // Check registered email
            (callback) => {
                rest.get('/api/1.0/signup/validate?login=' + TestUsers.User1Login,
                    (err, req, res, result) => {
                        assert.isNotNull(err);
                        callback();
                    }
                );
            },
        // Check not registered email
            (callback) => {
                rest.get('/api/1.0/signup/validate?login=xxx@gmail.com',
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            }
        ], done);
    });

    test('should not signup with the same email', (done) => {
        async.series([
        // Sign up
            (callback) => {
                rest.post('/api/1.0/signup',
                    USER,
                    (err, req, res, session) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Try to sign up again
            (callback) => {
                rest.post('/api/1.0/signup',
                    USER,
                    (err, req, res, session) => {
                        assert.isNotNull(err);
                        callback();
                    }
                );
            }
        ], done);

    });

    test('should signout', (done) => {
        rest.get('/api/1.0/signout',
            (err, req, res, result) => {
                assert.isNull(err);
                done();
            }
        );
    });

    test('should signin with email and password', (done) => {
        async.series([
        // Sign up
            (callback) => {
                rest.post('/api/1.0/signup',
                    USER,
                    (err, req, res, session) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Sign in with username
            (callback) => {
                rest.post('/api/1.0/signin',
                    {
                        login: USER.login,
                        password: USER.password
                    },
                    (err, req, res, session) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            }
        ], done);
    });

    test('should not signin with wrong password', (done) => {
        async.series([
        // Sign up
            (callback) => {
                rest.post('/api/1.0/signup',
                    USER,
                    (err, req, res, session) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Sign in with username
            (callback) => {
                rest.post('/api/1.0/signin',
                    {
                        login: USER.login,
                        password: 'xxx'
                    },
                    (err, req, res, session) => {
                        assert.isNotNull(err);
                        callback();
                    }
                );
            }
        ], done);
    });

    test('should get sessions as admin', (done) => {
        rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/1.0/sessions?paging=1&skip=0&take=2',
            (err, req, res, page) => {
                assert.isNull(err);

                assert.isObject(page);

                done();
            }
        );
    });

    test('should get user sessions as owner', (done) => {
        rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/1.0/sessions/' + TestUsers.User1SessionId + '?paging=1&skip=0&take=2',
            (err, req, res, page) => {
                assert.isNull(err);

                assert.isObject(page);

                done();
            }
        );
    });

    test('should close session', (done) => {
        let session1;

        async.series([
        // Sign up
            (callback) => {
                rest.post('/api/1.0/signup',
                    USER,
                    (err, req, res, session) => {
                        assert.isNull(err);

                        session1 = session;

                        callback();
                    }
                );
            },
        // Close session
            (callback) => {
                rest.del('/api/1.0/sessions/' + session1.id,
                    (err, req, res, session) => {
                        assert.isNull(err);

                        assert.isNotNull(session);
                        assert.equal(session.id, session1.id);

                        callback();
                    }
                );
            }
        ], done);
    });

});