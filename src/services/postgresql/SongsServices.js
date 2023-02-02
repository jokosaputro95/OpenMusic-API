const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelSong } = require('../../utils/songs');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
    }) {
        const id = `song-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async getSongs(requestQuery) {
        const { title, performer } = requestQuery;
        let filterQuery = ' ';

        const baseQuery = 'SELECT id, title, performer FROM songs';

        if (title && performer) {
            filterQuery += `WHERE LOWER(title) LIKE '%${title}%' AND LOWER(performer) LIKE '%${performer}%'`;
        } else if (title) {
            filterQuery += `WHERE LOWER(title) LIKE '%${title}%'`;
        } else if (performer) {
            filterQuery += `WHERE LOWER(performer) LIKE '%${performer}%'`;
        }

        const query = baseQuery + filterQuery;

        const result = await this._pool.query(query);
        return result.rows.map(mapDBToModelSong);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows.map(mapDBToModelSong)[0];
    }

    async editSongById(id, { title, year, performer, genre, duration }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = SongsService;