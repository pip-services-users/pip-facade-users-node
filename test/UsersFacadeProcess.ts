import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { TestFactory } from './fixtures/TestFactory';

export class UsersFacadeProcess extends ProcessContainer {

    public constructor() {
        super("facade", "Client facade for user management microservice");
        this._factories.add(new TestFactory);
    }

}
