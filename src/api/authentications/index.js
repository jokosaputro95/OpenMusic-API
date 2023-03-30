const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        AuthenticationsService,
        UsersService,
        TokenManager,
        AuthenticationsValidator,
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            AuthenticationsService,
            UsersService,
            TokenManager,
            AuthenticationsValidator,
        );

        server.route(routes(authenticationsHandler));
    },
};
