/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.addColumns('albums', {
        cover_url: {
            type: 'TEXT',
            default: null,
        },
    });
};
