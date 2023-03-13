const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSong(playlistId, { songId }) {
        const id = `playlist-song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist song gagal ditambahkan');
        }
    }

    // async getPlaylistSong(playlistId) {
    //     const query = {
    //         text: `SELECT playlists.id, playlists.name, users.username FROM playlists
    //         LEFT JOIN users ON users.id = playlists.owner
    //         WHERE playlists.id = $1`,
    //         values: [playlistId],
    //     };

    //     let result = await this._pool.query(query);

    //     if (!result.rowCount) {
    //         throw new NotFoundError('Playlist tidak ditemukan');
    //     }

    //     const songs = result.rows.map((song) => ({
    //         id: song.songs_id,
    //         title: song.title,
    //         performer: song.performer
    //     }))

    //     return {
    //         ...result.rows[0],
    //         songs
    //     }
    // }
    async getPlaylistSong(playlistId) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
            values: [playlistId],
        };

        let result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        const querySong = {
            // text: `SELECT A.id, A.name, C.username, B.id, B.title, B.performer
            // FROM playlist_songs D
            // INNER JOIN playlists A ON A.id = D.playlist_id
            // INNER JOIN users C ON A.owner = C.id
            // INNER JOIN songs B ON D.song_id = B.id
            // WHERE D.playlist_id = $1`,
            text: `SELECT A.id, C.id, C.title, C.performer FROM playlists A
            LEFT JOIN playlist_songs D ON D.playlist_id = A.id
            LEFT JOIN songs C ON C.id = D.song_id
            LEFT JOIN users B ON B.id = A.owner
            WHERE A.id = $1`,
            values: [playlistId],
        };

        result = await this._pool.query(querySong);

        playlist.songs = result.rows;

        return playlist;
    }

    async deletePlaylistSong(playlistId, songId) {
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

module.exports = PlaylistSongsService;