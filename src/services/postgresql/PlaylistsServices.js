const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
    constructor(collaborationsService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
    }

    async verifyPlaylistsOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak mempunyai hak akses pada playlist ini!');
        }
    }

    async verifyPlaylistsAccess(playlistId, userId) {
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

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan.');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT A.id, A.name, B.username
            FROM playlists A
            LEFT JOIN users B ON B.id = A.owner
            LEFT JOIN collaborations C ON C.playlist_id = A.id
            WHERE A.owner = $1 OR C.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deletePlaylistsById(id) {
        const query = {
            text: `DELETE FROM playlists WHERE id = $1 RETURNING id`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = PlaylistsService;