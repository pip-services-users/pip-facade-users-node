import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class UsersFacadeFactory extends Factory {
    static Descriptor: Descriptor;
    static SessionOperationsV1Descriptor: Descriptor;
    static AccountsOperationsV1Descriptor: Descriptor;
    static ActivitiesOperationsV1Descriptor: Descriptor;
    static PasswordsOperationsV1Descriptor: Descriptor;
    static RolesOperationsV1Descriptor: Descriptor;
    static EmailSettingsOperationsV1Descriptor: Descriptor;
    static SmsSettingsOperationsV1Descriptor: Descriptor;
    constructor();
}
