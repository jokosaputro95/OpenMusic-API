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
            text: `INSERT INTO playlist_song_activities (id, playlist_id, song_id, song_title, user_id, username, action, time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            values: [activitiesId, playlistId, songId, songTitle, userId, username, 'add', time],
        };

        await this._pool.query(query);
    }
    async activitiesDeleteSongPlaylist(playlistId, songId, userId) {
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
            text: `INSERT INTO playlist_song_activities (id, playlist_id, song_id, song_title, user_id, username, action, time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            values: [activitiesId, playlistId, songId, songTitle, userId, username, 'add', time],
        };

        await this._pool.query(query);
    }

    async getActivitiesSongPlaylist(playlistId) {
        const query = {
            text: 'SELECT * FROM playlist_song_activities WHERE playlist_id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Tidak ada aktivitas playlist')
        }

        const resultMap = result.rows.map((data) => ({
            username: data.username,
            title: data.song_title,
            action: data.action,
            time: data.time,
        }));

        return {
            playlistId: playlistId,
            activities: resultMap,
        };
    }
}

module.exports = PlaylistsSongsActivitiesService;