let UsersFacadeProcess = require('../obj/test/UsersFacadeProcess').UsersFacadeProcess;

try {
    new UsersFacadeProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
