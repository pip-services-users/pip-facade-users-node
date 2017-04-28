import { CompositeFactory } from 'pip-services-commons-node';
import { FacadeFactory } from 'pip-services-facade-node';
import { DefaultContainerFactory } from 'pip-services-container-node';

import { ActivitiesServiceFactory } from 'pip-services-activities-node';
import { ActivitiesClientFactory } from 'pip-clients-activities-node';
import { AccountsServiceFactory } from 'pip-services-accounts-node';
import { AccountsClientFactory } from 'pip-clients-accounts-node';
import { EmailServiceFactory } from 'pip-services-email-node';
import { EmailClientFactory } from 'pip-clients-email-node';
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
        this.add(new EmailServiceFactory);
        this.add(new EmailClientFactory);
        this.add(new PasswordsServiceFactory);
        this.add(new PasswordsClientFactory);
        this.add(new SessionsServiceFactory);
        this.add(new SessionsClientFactory);
        this.add(new RolesServiceFactory);
        this.add(new RolesClientFactory);
    }

}
