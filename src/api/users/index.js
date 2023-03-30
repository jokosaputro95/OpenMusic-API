const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'users',
    version: '1.0.0',
    register: async (server, { UsersService, UsersValidator }) => {
        const usersHandler = new UsersHandler(UsersService, UsersValidator);
        server.route(routes(usersHandler));
    },
};
