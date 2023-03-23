const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
    constructor(songsService, collaborationsService) {
        this._pool = new Pool();
        this._songsService = songsService;
        this._collaborationsService = collaborationsService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan.');
        }

        return result.rows[0].id;
    }

    async getPlaylist(owner) {
        const query = {
            text: `SELECT A.id, A.name, B.username
            FROM playlists A
            LEFT JOIN users B ON A.owner = B.id
            LEFT JOIN collaborations C ON C.playlist_id = A.id
            WHERE A.owner = $1 OR C.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0]?.id) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }

    async addSongToPlaylist(playlistId, songId) {
        await this._songsService.getSongById(songId);
        
        const id = `playlist-song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount === 0) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async getSongsFromInPlaylist(playlistId) {
        const query = {
            text: `SELECT A.id, A.name, B.username FROM playlists A
            LEFT JOIN users B ON B.id = A.owner
            WHERE A.id = $1`,
            values: [playlistId],
        };

        let result = await this._pool.query(query);
        
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const querySong = {
            text: `SELECT C.id, C.title, C.performer FROM playlists A
            INNER JOIN playlist_songs B ON B.playlist_id = A.id
            INNER JOIN songs C ON C.id = B.song_id
            WHERE A.id = $1`,
            values: [playlistId],
        };

        const playlist = result.rows[0];

        result = await this._pool.query(querySong);

        playlist.songs = result.rows;

        return playlist;
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount === 0) {
            throw new NotFoundError('Playlist song gagal dihapus, playlist id dan song id tidak ditemukan');
        }

        return result.rows[0].id;
    }

    async verifyPlaylistsOwner(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }

        const ownerId = result.rows[0].owner;

        if (ownerId !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistsOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService;