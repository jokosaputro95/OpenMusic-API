class AlbumsHandler {
    constructor(AlbumsService, SongsService, AlbumsValidator) {
        this._albumsService = AlbumsService;
        this._songsService = SongsService;
        this._albumsValidator = AlbumsValidator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        this._albumsValidator.validateAlbumsPayload(request.payload);

        const albumId = await this._albumsService.addAlbum(request.payload);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });

        response.code(201);
        return response;
    }

    async getAlbumsHandler() {
        const albums = await this._albumsService.getAlbums();

        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;

        const album = await this._albumsService.getAlbumById(id);
        album.songs = await this._songsService.getSongByAlbumId(id);

        return {
            status: 'success',
            data: {
                album,
            },
        }
    }

    async putAlbumByIdHandler(request, h) {
        this._albumsValidator.validateAlbumsPayload(request.payload);

        const { id } = request.params;
        await this._albumsService.editAlbumById(id, request.payload);

        return h.response({
            status: 'success',
            message: 'Album berhasil diperbarui',
        });
    }

    async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params;

        await this._albumsService.deleteAlbumById(id);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });

        return response;
    }
}

module.exports = AlbumsHandler;