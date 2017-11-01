import { Factory } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';

import { SessionsOperationsV1 } from '../operations/version1/SessionsOperationsV1';
import { AccountsOperationsV1 } from '../operations/version1/AccountsOperationsV1';
import { ActivitiesOperationsV1 } from '../operations/version1/ActivitiesOperationsV1';
import { PasswordsOperationsV1 } from '../operations/version1/PasswordsOperationsV1';
import { RolesOperationsV1 } from '../operations/version1/RolesOperationsV1';
import { EmailSettingsOperationsV1 } from '../operations/version1/EmailSettingsOperationsV1';
import { SmsSettingsOperationsV1 } from '../operations/version1/SmsSettingsOperationsV1';

export class UsersFacadeFactory extends Factory {
	public static Descriptor = new Descriptor("pip-facade-users", "factory", "default", "default", "1.0");

	public static SessionOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "sessions", "*", "1.0");
	public static AccountsOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "accounts", "*", "1.0");
	public static ActivitiesOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "activities", "*", "1.0");
	public static PasswordsOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "passwords", "*", "1.0");
	public static RolesOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "roles", "*", "1.0");
	public static EmailSettingsOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "email-settings", "*", "1.0");
	public static SmsSettingsOperationsV1Descriptor = new Descriptor("pip-facade-users", "operations", "sms-settings", "*", "1.0");
	
	public constructor() {
		super();

		this.registerAsType(UsersFacadeFactory.SessionOperationsV1Descriptor, SessionsOperationsV1);
		this.registerAsType(UsersFacadeFactory.AccountsOperationsV1Descriptor, AccountsOperationsV1);
		this.registerAsType(UsersFacadeFactory.ActivitiesOperationsV1Descriptor, ActivitiesOperationsV1);
		this.registerAsType(UsersFacadeFactory.PasswordsOperationsV1Descriptor, PasswordsOperationsV1);
		this.registerAsType(UsersFacadeFactory.RolesOperationsV1Descriptor, RolesOperationsV1);
		this.registerAsType(UsersFacadeFactory.EmailSettingsOperationsV1Descriptor, EmailSettingsOperationsV1);
		this.registerAsType(UsersFacadeFactory.SmsSettingsOperationsV1Descriptor, SmsSettingsOperationsV1);
	}
	
}
