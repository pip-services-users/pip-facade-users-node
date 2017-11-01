import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { FacadeOperations } from 'pip-services-facade-node';
export declare class SessionsOperationsV1 extends FacadeOperations {
    private static _defaultConfig1;
    private _cookie;
    private _cookieEnabled;
    private _maxCookieAge;
    private _accountsClient;
    private _sessionsClient;
    private _passwordsClient;
    private _rolesClient;
    private _emailSettingsClient;
    private _smsSettingsClient;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    loadSessionOperation(): (req: any, res: any, next: any) => void;
    signupOperation(): (req: any, res: any) => void;
    signupValidateOperation(): (req: any, res: any) => void;
    signinOperation(): (req: any, res: any) => void;
    signoutOperation(): (req: any, res: any) => void;
    getSessionsOperation(): (req: any, res: any) => void;
    restoreSessionOperation(): (req: any, res: any) => void;
    getUserSessionsOperation(): (req: any, res: any) => void;
    getCurrentSessionOperation(): (req: any, res: any) => void;
    closeSessionOperation(): (req: any, res: any) => void;
    private loadSession(req, res, next);
    private openSession(req, res, account, roles);
    private signup(req, res);
    private signupValidate(req, res);
    private signin(req, res);
    private signout(req, res);
    private getSessions(req, res);
    private restoreSession(req, res);
    private getUserSessions(req, res);
    private getCurrentSession(req, res);
    private closeSession(req, res);
}
