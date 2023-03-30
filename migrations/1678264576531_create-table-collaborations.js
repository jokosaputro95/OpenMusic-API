/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    pgm.addConstraint(
        'collaborations',
        'unique_playlist_id_and_user_id',
        'UNIQUE(playlist_id, user_id)',
    );

    pgm.addConstraint(
        'collaborations',
        'fk_collaborations.playlist_id',
        'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'collaborations',
        'fk_collaborations.user_id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('collaborations', 'unique_playlist_id_and_user_id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id');
    pgm.dropTable('collaborations');
};
