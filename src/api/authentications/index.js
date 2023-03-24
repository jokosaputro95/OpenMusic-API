const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authenticationsService,
        usersService,
        tokenManager,
        authenticationsValidator
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            authenticationsService,
            usersService,
            tokenManager,
            authenticationsValidator
        );
        
        server.route(routes(authenticationsHandler));
    },
};