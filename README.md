# Facade Operations for User Management Pip.Services in Node.js

This module contains REST operations for [Client Facade](github.com:pip-services/pip-services-facade-node.git).
Using these operations developers are able to create facades and fill them with pre-built REST operations for:

* Signin/signup and session management
* User accounts
* Password management
* Email settings
* Role management

<a name="links"></a> Quick Links:

* [Development Guide](doc/Development.md)
* [REST Protocol V1](doc/RestProtocolV1.md)

## Install

Add dependency to the facade and operations into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "pip-services-facade-node": "^1.0.*",
        "pip-facade-infrastructure-node": "^1.0.*",
        ...
    }
}
```

Then install the dependency using **npm** tool
```bash
# Install new dependencies
npm install

# Update already installed dependencies
npm update
```

## Use

Create facade service
```typescript
import { MainFacadeService } from 'pip-services-facade-node'

export class MyFacadeServiceV1 extends MainFacadeService {
    ...
}
```

Get or create operations and register routes in the facade service
```typescript
import { AccountsOperations } from 'pip-facade-users-node';

export class MyFacadeServiceV1 extends MainFacadeService {

    public register() {
        let logging = new LoggingOperations();
        this.registerRoute('get', '/accounts', logging.getAccountsOperation());
        this.registerRoute('get', '/accounts/current', logging.getCurrentAccountOperation());
        this.registerRoute('get', '/accounts/:account_id', logging.getAccountOperation());
    }

}
```

Instantiate and configure facade. After that create microservice clients and set references to the facade.
When everything is ready, run the facade.
```typescript
let myFacade = new MyFacadeServiceV1();
myFacade.configure(ConfigParams.fromTuples(
    'connection.protocol', 'http',
    'connection.host', '0.0.0.0',
    'connection.port', 8080
));

let accountsClient = new AccountsHttpClientV1();
accountsClient.configure(ConfigParams.fromTuples(
    'connection.protocol', 'http',
    'connection.host', 'localhost',
    'connection.port', 8082
));

let references = References.fromTuples(
    new Descriptor('pip-services-accounts', 'client', 'http', 'default', '1.0'), accountsClient
);
myFacade.setReferences(references)

myFacade.open(null, (err) => {
    if (err) console.error(err);
    else console.log('Client facade is running');
});
```

Alternatively to manual instantiation and cross-referencing you can use Pip.Services container
and instantiate the whole facade using simple configuration:
```yaml
---
-descriptor: pip-services-accounts:client:http:default:1.0
 connection:
   protocol: http
   host: localhost
   port: 8082

-descriptor: my-facade:service:facade:default:1.0
 connection:
   protocol: http
   host: 0.0.0.0
   port: 8080
```

## Acknowledgements

This client SDK was created and currently maintained by *Sergey Seroukhov*.

