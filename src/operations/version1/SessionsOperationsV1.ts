let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node'; 
import { DependencyResolver } from 'pip-services-commons-node';
import { BadRequestException } from 'pip-services-commons-node';
import { UnauthorizedException } from 'pip-services-commons-node';
import { HttpRequestDetector } from 'pip-services-rpc-node';

import { IAccountsClientV1 } from 'pip-clients-accounts-node';
import { AccountV1 } from 'pip-clients-accounts-node';
import { IPasswordsClientV1 } from 'pip-clients-passwords-node';
import { UserPasswordInfoV1 } from 'pip-clients-passwords-node';
import { IRolesClientV1 } from 'pip-clients-roles-node';
import { ISessionsClientV1 } from 'pip-clients-sessions-node';
import { SessionV1 } from 'pip-clients-sessions-node';
import { IEmailSettingsClientV1 } from 'pip-clients-emailsettings-node';
import { EmailSettingsV1 } from 'pip-clients-emailsettings-node';
import { ISmsSettingsClientV1 } from 'pip-clients-smssettings-node';
import { SmsSettingsV1 } from 'pip-clients-smssettings-node';

import { FacadeOperations } from 'pip-services-facade-node';
import { SessionUserV1 } from './SessionUserV1';

export class SessionsOperationsV1  extends FacadeOperations {
    private static _defaultConfig1 = ConfigParams.fromTuples(
        'options.cookie_enabled', true,
        'options.cookie', 'x-session-id',
        'options.max_cookie_age', 365 * 24 * 60 * 60 * 1000
    );

    private _cookie: string = 'x-session-id';
    private _cookieEnabled: boolean = true;
    private _maxCookieAge: number = 365 * 24 * 60 * 60 * 1000;

    private _accountsClient: IAccountsClientV1;
    private _sessionsClient: ISessionsClientV1;
    private _passwordsClient: IPasswordsClientV1;
    private _rolesClient: IRolesClientV1;
    private _emailSettingsClient: IEmailSettingsClientV1;
    private _smsSettingsClient: ISmsSettingsClientV1;
    
    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('roles', new Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new Descriptor('pip-services-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new Descriptor('pip-services-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
    }

    public configure(config: ConfigParams): void {
        config = config.setDefaults(SessionsOperationsV1._defaultConfig1);
        this._dependencyResolver.configure(config);

        this._cookieEnabled = config.getAsBooleanWithDefault('options.cookie_enabled', this._cookieEnabled);
        this._cookie = config.getAsStringWithDefault('options.cookie', this._cookie);
        this._maxCookieAge = config.getAsLongWithDefault('options.max_cookie_age', this._maxCookieAge);
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._sessionsClient = this._dependencyResolver.getOneRequired<ISessionsClientV1>('sessions');
        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired<IPasswordsClientV1>('passwords');
        this._rolesClient = this._dependencyResolver.getOneOptional<IRolesClientV1>('roles');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional<IEmailSettingsClientV1>('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional<ISmsSettingsClientV1>('smssettings');
    }

    public loadSessionOperation() {
        return (req, res, next) => {
            this.loadSession(req, res, next);
        }
    }

    public signupOperation() {
        return (req, res) => {
            this.signup(req, res);
        }
    }

    public signupValidateOperation() {
        return (req, res) => {
            this.signupValidate(req, res);
        }
    }

    public signinOperation() {
        return (req, res) => {
            this.signin(req, res);
        }
    }

    public signoutOperation() {
        return (req, res) => {
            this.signout(req, res);
        }
    }

    public getSessionsOperation() {
        return (req, res) => {
            this.getSessions(req, res);
        }
    }

    public restoreSessionOperation() {
        return (req, res) => {
            this.restoreSession(req, res);
        }
    }

    public getUserSessionsOperation() {
        return (req, res) => {
            this.getUserSessions(req, res);
        }
    }

    public getCurrentSessionOperation() {
        return (req, res) => {
            this.getCurrentSession(req, res);
        }
    }

    public closeSessionOperation() {
        return (req, res) => {
            this.closeSession(req, res);
        }
    }
    
    private loadSession(req: any, res: any, next: () => void): void {
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
                    err = new UnauthorizedException(
                        'facade', 
                        'SESSION_NOT_FOUND', 
                        'Session invalid or already expired.'
                    ).withDetails('session_id', sessionId).withStatus(440);
                }

                if (err == null) {
                    // Associate session user with the request
                    req.user_id = session.user_id;
                    req.user_name = session.user_name;
                    req.user = session.user;
                    req.session_id = session.id;
                    next();
                } else {
                    this.sendError(req, res, err);
                }
            });
        } else {
            next();
        }
    }

    private openSession(req: any, res: any, account: AccountV1, roles: string[]): void {
        let session: SessionV1;
        let passwordInfo: UserPasswordInfoV1;

        async.series([
            (callback) => {
                this._passwordsClient.getPasswordInfo(
                    null, account.id, (err, data) => {
                        passwordInfo = data;
                        callback(err);
                    }
                )
            },
            (callback) => {
                let user = <SessionUserV1>{
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

                let address = HttpRequestDetector.detectAddress(req);
                let client = HttpRequestDetector.detectBrowser(req);
                let platform = HttpRequestDetector.detectPlatform(req);

                this._sessionsClient.openSession(
                    null, account.id, account.name,
                    address, client, user, null,
                    (err, data) => {
                        session = data;
                        callback(err);
                    }
                );
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

    private signup(req: any, res: any): void {
        let signupData = req.body;
        let account: AccountV1 = null;
        
        async.series([
            // Validate password first
            (callback) => {
                // Todo: complete implementation after validate password is added
                callback();
            },
            // Create account
            (callback) => {
                let newAccount = <AccountV1>{
                    name: signupData.name,
                    login: signupData.login || signupData.email,
                    language: signupData.language,
                    theme: signupData.theme,
                    time_zone: signupData.time_zone
                };

                this._accountsClient.createAccount(
                    null, newAccount, 
                    (err, data) => {
                        account = data;
                        callback(err);
                    }
                )
            },
            // Create password for the account
            (callback) => {
                let password = signupData.password;

                this._passwordsClient.setPassword(
                    null, account.id, password, callback
                );
            },
            // Create email settings for the account
            (callback) => {
                let email = signupData.email;
                let newEmailSettings = <EmailSettingsV1>{
                    id: account.id,
                    name: account.name,
                    email: email,
                    language: account.language
                };

                if (this._emailSettingsClient != null) {
                    this._emailSettingsClient.setSettings(
                        null, newEmailSettings, callback
                    );
                } else callback();
            },
            // Create sms settings for the account
            (callback) => {
                let phone = signupData.phone;
                let newSmsSettings = <SmsSettingsV1>{
                    id: account.id,
                    name: account.name,
                    phone: phone,
                    language: account.language
                };

                if (phone != null && this._emailSettingsClient != null) {
                    this._smsSettingsClient.setSettings(
                        null, newSmsSettings, callback
                    );
                } else callback();
            }
        ], (err) => {
            if (err) 
                this.sendError(req, res, err);
            else
                this.openSession(req, res, account, []);
        });
    }

    private signupValidate(req: any, res: any): void {
        let login = req.param('login');

        if (login) {
            this._accountsClient.getAccountByIdOrLogin(
                null, login, (err, account) => {
                    if (err == null && account != null) {
                        err = new BadRequestException(
                            null, 'LOGIN_ALREADY_USED',
                            'Login ' + login + ' already being used'
                        ).withDetails('login', login);
                    }

                    if (err) this.sendError(req, res, err);
                    else res.json(204);
                }
            );
        }
        else {
            res.json(204);
        }
    }

    private signin(req: any, res: any): void {
        let login = req.param('login');
        let password = req.param('password');

        let account: AccountV1;
        let roles: string[] = [];

        async.series([
            // Find user account
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new BadRequestException(
                            null,
                            'WRONG_LOGIN',
                            'Account ' + login + ' was not found'
                        ).withDetails('login', login);
                    }

                    account = data;
                    callback(err);
                });
            },
            // Authenticate user
            (callback) => {
                this._passwordsClient.authenticate(null, account.id, password, (err, result) => {
                    if (err == null && result == false) {
                        err = new BadRequestException(
                            null, 
                            'WRONG_PASSWORD',
                            'Wrong password for account ' + login
                        ).withDetails('login', login);
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
                } else {
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

    private signout(req: any, res: any): void {
        // Cleanup cookie with session id
        if (this._cookieEnabled)
            res.clearCookie(this._cookie);

        if (req.session_id) {
            this._sessionsClient.closeSession(null, req.session_id, (err, session) => {
                if (err) this.sendError(req, res, err);
                else res.json('OK');
            });
        } else {
            res.json('OK');
        }
    }

    private getSessions(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        this._sessionsClient.getSessions(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    private restoreSession(req: any, res: any): void {
        let sessionId = req.param('session_id');

        this._sessionsClient.getSessionById(
            null, sessionId, this.sendResult(req, res)
        );
    }

    private getUserSessions(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let userId = req.route.params.user_id || req.route.params.account_id;
        filter.setAsObject('user_id', userId);

        this._sessionsClient.getSessions(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    private getCurrentSession(req: any, res: any): void {
        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id'] || req.cookies[this._cookie];

        this._sessionsClient.getSessionById(
            null, sessionId, this.sendResult(req, res)
        );
    }

    private closeSession(req: any, res: any): void {
        let sessionId = req.route.params.session_id || req.param('session_id');

        this._sessionsClient.closeSession(
            null, sessionId, this.sendResult(req, res)
        );
    }
}