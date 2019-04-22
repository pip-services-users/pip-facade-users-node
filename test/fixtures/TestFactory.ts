import { CompositeFactory } from 'pip-services3-components-node';
import { FacadeFactory } from 'pip-services3-facade-node';
import { DefaultContainerFactory } from 'pip-services3-container-node';

import { ActivitiesServiceFactory } from 'pip-services-activities-node';
import { ActivitiesClientFactory } from 'pip-clients-activities-node';
import { AccountsServiceFactory } from 'pip-services-accounts-node';
import { AccountsClientFactory } from 'pip-clients-accounts-node';
import { EmailSettingsServiceFactory } from 'pip-services-emailsettings-node';
import { EmailSettingsClientFactory } from 'pip-clients-emailsettings-node';
import { SmsSettingsServiceFactory } from 'pip-services-smssettings-node';
import { SmsSettingsClientFactory } from 'pip-clients-smssettings-node';
import { PasswordsServiceFactory } from 'pip-services-passwords-node';
import { PasswordsClientFactory } from 'pip-clients-passwords-node';
import { SessionsServiceFactory } from 'pip-services-sessions-node';
import { SessionsClientFactory } from 'pip-clients-sessions-node';
import { RolesServiceFactory } from 'pip-services-roles-node';
import { RolesClientFactory } from 'pip-clients-roles-node';

import { UsersFacadeFactory } from '../../src/build/UsersFacadeFactory';
import { TestFacadeFactory } from './TestFacadeFactory';

export class TestFactory extends DefaultContainerFactory {

    public constructor() {
        super();

        this.add(new FacadeFactory);
        this.add(new UsersFacadeFactory);
        this.add(new TestFacadeFactory);

        this.add(new ActivitiesServiceFactory);
        this.add(new ActivitiesClientFactory);
        this.add(new AccountsServiceFactory);
        this.add(new AccountsClientFactory);
        this.add(new EmailSettingsServiceFactory);
        this.add(new EmailSettingsClientFactory);
        this.add(new SmsSettingsServiceFactory);
        this.add(new SmsSettingsClientFactory);
        this.add(new PasswordsServiceFactory);
        this.add(new PasswordsClientFactory);
        this.add(new SessionsServiceFactory);
        this.add(new SessionsClientFactory);
        this.add(new RolesServiceFactory);
        this.add(new RolesClientFactory);
    }

}
