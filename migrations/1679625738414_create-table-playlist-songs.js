/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
        },
        song_id: {
            type: 'VARCHAR(50)',
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
        'playlist_songs',
        'fk_playlist.playlist_id',
        'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist.song_id',
        'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('playlist_songs', 'fk_playlist.playlist_id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist.song_id');
    pgm.dropTable('playlist_songs');
};
