const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongToPlaylist({ playlistId, songId }) {
        const songQuery = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId],
        };

        const songResult = await this._pool.query(songQuery);
        
        if (!songResult.rowCount) {
            throw new NotFoundError('Lagu gagal ditambahkan');
        }

        const id = `playlist-song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }
        // return result.rows[0].id;
    }

    async getSongsFromPlaylist(playlistId) {
        const playlistQuery = {
            text: `SELECT A.id, A.name, B.username
            FROM playlist_songs C
            INNER JOIN playlists A ON C.playlist_id = A.id
            INNER JOIN users B ON A.owner = B.id
            WHERE playlist_id = $1`,
            values: [playlistId],
        };

        const queryUser = {
            text: `SELECT username FROM playlists A
            INNER JOIN users B ON A.owner = B.id
            WHERE A.id = $1 LIMIT 1`,
            values: [playlistId],
        };

        const querySong = {
            text: `SELECT A.id, C.id, C.title, C.performer FROM playlists A
            LEFT JOIN playlist_songs D ON D.playlist_id = A.id
            LEFT JOIN songs C ON C.id = D.song_id
            LEFT JOIN users B ON B.id = A.owner
            WHERE A.id = $1`,
            values: [playlistId],
        };

        const playlistResult = await this._pool.query(playlistQuery);
        const userResult = await this._pool.query(queryUser);
        const songResult = await this._pool.query(querySong);

        if (!playlistResult.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        if (!userResult.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }

        if (!songResult.rowCount) {
            throw new NotFoundError('Lagu tidak ditemykan');
        }

        return {
            id: playlistResult.rows[0].id,
            name: playlistResult.rows[0].name,
            username: userResult.rows[0].username,
            songs: songResult.rows,
        };
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist song gagal dihapus, playlist id dan song id tidak ditemukan');
        }
    }
}

module.exports = PlaylistsSongsService;