class PlaylistSongActivitiesHandler {
    constructor(playlistService, playlistSongsActivities) {
        this._playlistService = playlistService;
        this._playlistSongsActivities = playlistSongsActivities;
    }

    async getPlaylistSongActivities(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistService.verifyPlaylistOwner(id, credentialId);
        const { playlistId, activities } = await this._playlistSongsActivities.getPlaylistSongActivities(id);

        const response = h.response({
            status: 'success',
            data: {
                playlistId,
                activities,
            },
        });
        response.code(200);
        return response;
    }
}

module.exports = PlaylistSongActivitiesHandler;