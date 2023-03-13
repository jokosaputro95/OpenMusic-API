const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelAlbum } = require('../../utils/albums');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');


class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows.map(mapDBToModelAlbum);
    }

    async getAlbumById(id) {
        const queryAlbum = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const resultAlbum = await this._pool.query(queryAlbum);

        if (!resultAlbum.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const querySongInAlbum = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        }
        const resultSong = await this._pool.query(querySongInAlbum);

        const result = {
            ...resultAlbum.rows[0],
            songs: resultSong.rows
        }
        return result;

        // return resultAlbum.rows.map(mapDBToModelAlbum)[0];
        // const querySong = {
        //     text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN albums ON albums.id=songs."albumId" WHERE albums.id=$1',
        //     values: [id],
        // }


        // const resultSong = await this._pool.query(querySong);


        // return {
        //     id: resultAlbum.rows[0].id,
        //     name: resultAlbum.rows[0].name,
        //     year: resultAlbum.rows[0].year,
        //     songs: resultSong.rows,

        // };

    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = AlbumsService;