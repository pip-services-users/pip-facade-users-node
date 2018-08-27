"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const pip_services_facade_node_1 = require("pip-services-facade-node");
class SessionsOperationsV1 extends pip_services_facade_node_1.FacadeOperations {
    constructor() {
        super();
        this._cookie = 'x-session-id';
        this._cookieEnabled = true;
        this._maxCookieAge = 365 * 24 * 60 * 60 * 1000;
        this._dependencyResolver.put('accounts', new pip_services_commons_node_2.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services_commons_node_2.Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('roles', new pip_services_commons_node_2.Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new pip_services_commons_node_2.Descriptor('pip-services-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new pip_services_commons_node_2.Descriptor('pip-services-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new pip_services_commons_node_2.Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
    }
    configure(config) {
        config = config.setDefaults(SessionsOperationsV1._defaultConfig1);
        this._dependencyResolver.configure(config);
        this._cookieEnabled = config.getAsBooleanWithDefault('options.cookie_enabled', this._cookieEnabled);
        this._cookie = config.getAsStringWithDefault('options.cookie', this._cookie);
        this._maxCookieAge = config.getAsLongWithDefault('options.max_cookie_age', this._maxCookieAge);
    }
    setReferences(references) {
        super.setReferences(references);
        this._sessionsClient = this._dependencyResolver.getOneRequired('sessions');
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
        this._rolesClient = this._dependencyResolver.getOneOptional('roles');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional('smssettings');
    }
    loadSessionOperation() {
        return (req, res, next) => {
            this.loadSession(req, res, next);
        };
    }
    signupOperation() {
        return (req, res) => {
            this.signup(req, res);
        };
    }
    signupValidateOperation() {
        return (req, res) => {
            this.signupValidate(req, res);
        };
    }
    signinOperation() {
        return (req, res) => {
            this.signin(req, res);
        };
    }
    signoutOperation() {
        return (req, res) => {
            this.signout(req, res);
        };
    }
    getSessionsOperation() {
        return (req, res) => {
            this.getSessions(req, res);
        };
    }
    restoreSessionOperation() {
        return (req, res) => {
            this.restoreSession(req, res);
        };
    }
    getUserSessionsOperation() {
        return (req, res) => {
            this.getUserSessions(req, res);
        };
    }
    getCurrentSessionOperation() {
        return (req, res) => {
            this.getCurrentSession(req, res);
        };
    }
    closeSessionOperation() {
        return (req, res) => {
            this.closeSession(req, res);
        };
    }
    loadSession(req, res, next) {
        // Is user really cached? If yes, then we shall reinvalidate cache when connections are changed
        // if (req.user) {
        //     callback(null, req.user);
        //     return;
        // }
        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id'] || req.cookies[this._cookie];
        if (sessionId) {
            this._sessionsClient.getSessionById('facade', sessionId, (err, session) => {
                if (session == null && err == null) {
                    err = new pip_services_commons_node_4.UnauthorizedException('facade', 'SESSION_NOT_FOUND', 'Session invalid or already expired.').withDetails('session_id', sessionId).withStatus(440);
                }
                if (err == null) {
                    // Associate session user with the request
                    req.user_id = session.user_id;
                    req.user_name = session.user_name;
                    req.user = session.user;
                    req.session_id = session.id;
                    next();
                }
                else {
                    this.sendError(req, res, err);
                }
            });
        }
        else {
            next();
        }
    }
    openSession(req, res, account, roles) {
        let session;
        let passwordInfo;
        async.series([
            (callback) => {
                this._passwordsClient.getPasswordInfo(null, account.id, (err, data) => {
                    passwordInfo = data;
                    callback(err);
                });
            },
            (callback) => {
                let user = {
                    id: account.id,
                    name: account.name,
                    login: account.login,
                    create_time: account.create_time,
                    time_zone: account.time_zone,
                    language: account.language,
                    theme: account.theme,
                    roles: roles,
                    change_pwd_time: passwordInfo != null ? passwordInfo.change_time : null,
                    custom_hdr: account.custom_hdr,
                    custom_dat: account.custom_dat
                };
                let address = pip_services_rpc_node_1.HttpRequestDetector.detectAddress(req);
                let client = pip_services_rpc_node_1.HttpRequestDetector.detectBrowser(req);
                let platform = pip_services_rpc_node_1.HttpRequestDetector.detectPlatform(req);
                this._sessionsClient.openSession(null, account.id, account.name, address, client, user, null, (err, data) => {
                    session = data;
                    callback(err);
                });
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else {
                // Set cookie with session id
                if (session && this._cookieEnabled)
                    res.cookie(this._cookie, session.id, { maxAge: this._maxCookieAge });
                res.json(session);
            }
        });
    }
    signup(req, res) {
        let signupData = req.body;
        let account = null;
        async.series([
            // Validate password first
            (callback) => {
                // Todo: complete implementation after validate password is added
                callback();
            },
            // Create account
            (callback) => {
                let newAccount = {
                    name: signupData.name,
                    login: signupData.login || signupData.email,
                    language: signupData.language,
                    theme: signupData.theme,
                    time_zone: signupData.time_zone
                };
                this._accountsClient.createAccount(null, newAccount, (err, data) => {
                    account = data;
                    callback(err);
                });
            },
            // Create password for the account
            (callback) => {
                let password = signupData.password;
                this._passwordsClient.setPassword(null, account.id, password, callback);
            },
            // Create email settings for the account
            (callback) => {
                let email = signupData.email;
                let newEmailSettings = {
                    id: account.id,
                    name: account.name,
                    email: email,
                    language: account.language
                };
                if (this._emailSettingsClient != null) {
                    this._emailSettingsClient.setSettings(null, newEmailSettings, callback);
                }
                else
                    callback();
            },
            // Create sms settings for the account
            (callback) => {
                let phone = signupData.phone;
                let newSmsSettings = {
                    id: account.id,
                    name: account.name,
                    phone: phone,
                    language: account.language
                };
                if (phone != null && this._emailSettingsClient != null) {
                    this._smsSettingsClient.setSettings(null, newSmsSettings, callback);
                }
                else
                    callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                this.openSession(req, res, account, []);
        });
    }
    signupValidate(req, res) {
        let login = req.param('login');
        if (login) {
            this._accountsClient.getAccountByIdOrLogin(null, login, (err, account) => {
                if (err == null && account != null) {
                    err = new pip_services_commons_node_3.BadRequestException(null, 'LOGIN_ALREADY_USED', 'Login ' + login + ' already being used').withDetails('login', login);
                }
                if (err)
                    this.sendError(req, res, err);
                else
                    res.json(204);
            });
        }
        else {
            res.json(204);
        }
    }
    signin(req, res) {
        let login = req.param('login');
        let password = req.param('password');
        let account;
        let roles = [];
        async.series([
            // Find user account
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services_commons_node_3.BadRequestException(null, 'WRONG_LOGIN', 'Account ' + login + ' was not found').withDetails('login', login);
                    }
                    account = data;
                    callback(err);
                });
            },
            // Authenticate user
            (callback) => {
                this._passwordsClient.authenticate(null, account.id, password, (err, result) => {
                    if (err == null && result == false) {
                        err = new pip_services_commons_node_3.BadRequestException(null, 'WRONG_PASSWORD', 'Wrong password for account ' + login).withDetails('login', login);
                    }
                    callback(err);
                });
            },
            // Retrieve user roles
            (callback) => {
                if (this._rolesClient) {
                    this._rolesClient.getRolesById(null, account.id, (err, data) => {
                        roles = data;
                        callback(err);
                    });
                }
                else {
                    roles = [];
                    callback();
                }
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                this.openSession(req, res, account, roles);
        });
    }
    signout(req, res) {
        // Cleanup cookie with session id
        if (this._cookieEnabled)
            res.clearCookie(this._cookie);
        if (req.session_id) {
            this._sessionsClient.closeSession(null, req.session_id, (err, session) => {
                if (err)
                    this.sendError(req, res, err);
                else
                    res.json('OK');
            });
        }
        else {
            res.json('OK');
        }
    }
    getSessions(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        this._sessionsClient.getSessions(null, filter, paging, this.sendResult(req, res));
    }
    restoreSession(req, res) {
        let sessionId = req.param('session_id');
        this._sessionsClient.getSessionById(null, sessionId, this.sendResult(req, res));
    }
    getUserSessions(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let userId = req.route.params.user_id || req.route.params.account_id;
        filter.setAsObject('user_id', userId);
        this._sessionsClient.getSessions(null, filter, paging, this.sendResult(req, res));
    }
    getCurrentSession(req, res) {
        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id'] || req.cookies[this._cookie];
        this._sessionsClient.getSessionById(null, sessionId, this.sendResult(req, res));
    }
    closeSession(req, res) {
        let sessionId = req.route.params.session_id || req.param('session_id');
        this._sessionsClient.closeSession(null, sessionId, this.sendResult(req, res));
    }
}
SessionsOperationsV1._defaultConfig1 = pip_services_commons_node_1.ConfigParams.fromTuples('options.cookie_enabled', true, 'options.cookie', 'x-session-id', 'options.max_cookie_age', 365 * 24 * 60 * 60 * 1000);
exports.SessionsOperationsV1 = SessionsOperationsV1;
//# sourceMappingURL=SessionsOperationsV1.js.map