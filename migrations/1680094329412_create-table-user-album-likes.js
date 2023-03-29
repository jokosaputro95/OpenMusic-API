/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        album_id: {
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
        'user_album_likes',
        'unique_album_id_and_user_id',
        'UNIQUE(album_id, user_id)',
    );

    pgm.addConstraint(
        'user_album_likes',
        'fk_user_album_likes.album_id',
        'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'user_album_likes',
        'fk_user_album_likes.user_id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('user_album_likes', 'unique_album_id_and_user_id');
    pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id');
    pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id');
    pgm.dropTable('user_album_likes');
};