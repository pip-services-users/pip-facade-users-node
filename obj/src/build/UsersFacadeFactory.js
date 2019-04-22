"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const SessionsOperationsV1_1 = require("../operations/version1/SessionsOperationsV1");
const AccountsOperationsV1_1 = require("../operations/version1/AccountsOperationsV1");
const ActivitiesOperationsV1_1 = require("../operations/version1/ActivitiesOperationsV1");
const PasswordsOperationsV1_1 = require("../operations/version1/PasswordsOperationsV1");
const RolesOperationsV1_1 = require("../operations/version1/RolesOperationsV1");
const EmailSettingsOperationsV1_1 = require("../operations/version1/EmailSettingsOperationsV1");
const SmsSettingsOperationsV1_1 = require("../operations/version1/SmsSettingsOperationsV1");
class UsersFacadeFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(UsersFacadeFactory.SessionOperationsV1Descriptor, SessionsOperationsV1_1.SessionsOperationsV1);
        this.registerAsType(UsersFacadeFactory.AccountsOperationsV1Descriptor, AccountsOperationsV1_1.AccountsOperationsV1);
        this.registerAsType(UsersFacadeFactory.ActivitiesOperationsV1Descriptor, ActivitiesOperationsV1_1.ActivitiesOperationsV1);
        this.registerAsType(UsersFacadeFactory.PasswordsOperationsV1Descriptor, PasswordsOperationsV1_1.PasswordsOperationsV1);
        this.registerAsType(UsersFacadeFactory.RolesOperationsV1Descriptor, RolesOperationsV1_1.RolesOperationsV1);
        this.registerAsType(UsersFacadeFactory.EmailSettingsOperationsV1Descriptor, EmailSettingsOperationsV1_1.EmailSettingsOperationsV1);
        this.registerAsType(UsersFacadeFactory.SmsSettingsOperationsV1Descriptor, SmsSettingsOperationsV1_1.SmsSettingsOperationsV1);
    }
}
UsersFacadeFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "factory", "default", "default", "1.0");
UsersFacadeFactory.SessionOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "sessions", "*", "1.0");
UsersFacadeFactory.AccountsOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "accounts", "*", "1.0");
UsersFacadeFactory.ActivitiesOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "activities", "*", "1.0");
UsersFacadeFactory.PasswordsOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "passwords", "*", "1.0");
UsersFacadeFactory.RolesOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "roles", "*", "1.0");
UsersFacadeFactory.EmailSettingsOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "email-settings", "*", "1.0");
UsersFacadeFactory.SmsSettingsOperationsV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-users", "operations", "sms-settings", "*", "1.0");
exports.UsersFacadeFactory = UsersFacadeFactory;
//# sourceMappingURL=UsersFacadeFactory.js.map