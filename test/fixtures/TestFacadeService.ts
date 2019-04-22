import { Descriptor } from 'pip-services3-commons-node';
import { PartitionFacadeService } from 'pip-services3-facade-node';

import { SessionsOperationsV1 } from '../../src/operations/version1/SessionsOperationsV1';
import { AccountsOperationsV1 } from '../../src/operations/version1/AccountsOperationsV1';
import { ActivitiesOperationsV1 } from '../../src/operations/version1/ActivitiesOperationsV1';
import { PasswordsOperationsV1 } from '../../src/operations/version1/PasswordsOperationsV1';
import { RolesOperationsV1 } from '../../src/operations/version1/RolesOperationsV1';
import { EmailSettingsOperationsV1 } from '../../src/operations/version1/EmailSettingsOperationsV1';
import { SmsSettingsOperationsV1 } from '../../src/operations/version1/SmsSettingsOperationsV1';

export class TestFacadeService extends PartitionFacadeService {

    public constructor() {
        super();

        this._dependencyResolver.put('sessions', new Descriptor("pip-facade-users", "operations", "sessions", "*", "1.0"));
        this._dependencyResolver.put('accounts', new Descriptor("pip-facade-users", "operations", "accounts", "*", "1.0"));
        this._dependencyResolver.put('activities', new Descriptor("pip-facade-users", "operations", "activities", "*", "1.0"));
        this._dependencyResolver.put('passwords', new Descriptor("pip-facade-users", "operations", "passwords", "*", "1.0"));
        this._dependencyResolver.put('roles', new Descriptor("pip-facade-users", "operations", "roles", "*", "1.0"));
        this._dependencyResolver.put('email-settings', new Descriptor("pip-facade-users", "operations", "email-settings", "*", "1.0"));
        this._dependencyResolver.put('sms-settings', new Descriptor("pip-facade-users", "operations", "sms-settings", "*", "1.0"));
    }

    // Todo: Add proper authorization for testing
    protected register(): void {
        let sessions = this._dependencyResolver.getOneOptional<SessionsOperationsV1>('sessions');
        if (sessions) {
            this.registerMiddleware(sessions.loadSessionOperation());
            this.registerRoute('all', '/signup', sessions.signupOperation());
            this.registerRoute('get', '/signup/validate', sessions.signupValidateOperation());
            this.registerRoute('all', '/signin', sessions.signinOperation());
            this.registerRoute('all', '/signout', sessions.signoutOperation());

            this.registerRoute('get', '/sessions', sessions.getSessionsOperation());
            this.registerRoute('post', '/sessions/restore', sessions.restoreSessionOperation());
            this.registerRoute('get', '/sessions/current', sessions.getCurrentSessionOperation());
            this.registerRoute('get', '/sessions/:user_id', sessions.getUserSessionsOperation());
            this.registerRoute('del', '/sessions/:session_id', sessions.closeSessionOperation());
        }

        let accounts = this._dependencyResolver.getOneOptional<AccountsOperationsV1>('accounts');
        if (accounts) {
            this.registerRoute('get', '/accounts', accounts.getAccountsOperation());
            this.registerRoute('get', '/accounts/current', accounts.getCurrentAccountOperation());
            this.registerRoute('get', '/accounts/:user_id', accounts.getAccountOperation());
            this.registerRoute('post', '/accounts', accounts.createAccountOperation());
            this.registerRoute('put', '/accounts/:user_id', accounts.updateAccountOperation());
            this.registerRoute('del', '/accounts/:user_id', accounts.deleteAccountOperation());
        }

        let activities = this._dependencyResolver.getOneOptional<ActivitiesOperationsV1>('activities');
        if (activities) {
            this.registerRoute('get', '/activities', activities.getActivitiesOperation());
            this.registerRoute('get', '/activities/:party_id', activities.getPartyActivitiesOperation());
            this.registerRoute('post', '/activities', activities.logPartyActivityOperation());
        }

        let passwords = this._dependencyResolver.getOneOptional<PasswordsOperationsV1>('passwords');
        if (passwords) {
            this.registerRoute('post', '/passwords/recover', passwords.recoverPasswordOperation());
            this.registerRoute('post', '/passwords/reset', passwords.resetPasswordOperation());
            this.registerRoute('post', '/passwords/:user_id/change', passwords.changePasswordOperation());
        }

        let emailSettings = this._dependencyResolver.getOneOptional<EmailSettingsOperationsV1>('email-settings');
        if (emailSettings) {
            this.registerRoute('post', '/email_settings/resend', emailSettings.resendVerificationOperation());
            this.registerRoute('post', '/email_settings/verify', emailSettings.verifyEmailOperation());
            this.registerRoute('get', '/email_settings/:user_id', emailSettings.getEmailSettingsOperation());
            this.registerRoute('put', '/email_settings/:user_id', emailSettings.setEmailSettingsOperation());
        }

        let smsSettings = this._dependencyResolver.getOneOptional<SmsSettingsOperationsV1>('sms-settings');
        if (smsSettings) {
            this.registerRoute('post', '/sms_settings/resend', smsSettings.resendVerificationOperation());
            this.registerRoute('post', '/sms_settings/verify', smsSettings.verifyPhoneOperation());
            this.registerRoute('get', '/sms_settings/:user_id', smsSettings.getSmsSettingsOperation());
            this.registerRoute('put', '/sms_settings/:user_id', smsSettings.setSmsSettingsOperation());
        }

        let roles = this._dependencyResolver.getOneOptional<RolesOperationsV1>('roles');
        if (roles) {
            this.registerRoute('get', '/roles/:user_id', roles.getUserRolesOperation());
            this.registerRoute('post', '/roles/:user_id/grant', roles.grantUserRolesOperation());
            this.registerRoute('post', '/roles/:user_id/revoke', roles.revokeUserRolesOperation());
        }
    }

}