const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsSongsActivitiesService {
    constructor() {
        this._pool = new Pool();
    }

    async activitiesAddSongPlaylist(playlistId, songId, userId) {
        const songQuery = {
            text: 'SELECT title FROM songs WHERE id = $1',
            values: [songId],
        };

        const queryUser = {
            text: 'SELECT username FROM users WHERE id = $1',
            values: [userId],
        };

        const songResult = await this._pool.query(songQuery);
        const userQuery = await this._pool.query(queryUser);
        
        const songTitle = songResult.rows[0].title;
        const { username } = userQuery.rows[0];

        const activitiesId = `activity-${nanoid(16)}`;
        const time = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [activitiesId, playlistId, songId, songTitle, userId, username, 'add', time],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvarianError('Activity gagal ditambahkan ke playlist');
        }

        return result.rows[0].id;
    }

    async getActivitiesSongPlaylist(playlistId) {
        const query = {
            text: `SELECT B.username, C.title, A.action, A.time FROM playlist_song_activities A
            LEFT JOIN users B ON B.id = A.user_id
            LEFT JOIN songs C ON C.id = A.song_id
            WHERE A.playlist_id = $1
            ORDER BY A.action`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Tidak ada aktivitas playlist')
        }

        return {
            playlistId: playlistId,
            activities: result.rows,
        };
    }
}

module.exports = PlaylistsSongsActivitiesService;