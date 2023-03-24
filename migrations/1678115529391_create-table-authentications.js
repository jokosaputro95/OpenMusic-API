/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('authentications', {
        token: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('authentications');
};
