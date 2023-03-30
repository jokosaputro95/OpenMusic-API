const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongToPlaylist(playlistId, songId) {
        const songQuery = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId],
        };

        const songResult = await this._pool.query(songQuery);

        if (!songResult.rowCount) {
            throw new NotFoundError('Lagu gagal ditambahkan');
        }

        const id = `playlist-song-${nanoid(16)}`;

        const playlistQuery = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        await this._pool.query(playlistQuery);
    }

    async getSongsFromPlaylist(playlistId) {
        const playlistQuery = {
            text: `SELECT B.id, B.name, C.username 
            FROM playlist_songs A
            INNER JOIN playlists B ON A.playlist_id = B.id 
            INNER JOIN users C ON B.owner = C.id 
            WHERE playlist_id = $1`,
            values: [playlistId],
        };

        const userQuery = {
            text: `SELECT username FROM playlists A
            INNER JOIN users B ON A.owner = B.id
            WHERE A.id = $1`,
            values: [playlistId],
        };

        const songQuery = {
            text: `SELECT B.id, B.title, B.performer
            FROM playlist_songs A
            INNER JOIN songs B ON A.song_id = B.id
            WHERE playlist_id = $1`,
            values: [playlistId],
        };

        const playlistResult = await this._pool.query(playlistQuery);
        const userResult = await this._pool.query(userQuery);
        const songResult = await this._pool.query(songQuery);

        if (!playlistResult.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan!');
        }

        if (!userResult.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }

        if (!songResult.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
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
            text: `DELETE FROM playlist_songs
            WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist song gagal dihapus, playlist id dan song id tidak ditemukan');
        }
    }
}

module.exports = PlaylistsSongsService;
