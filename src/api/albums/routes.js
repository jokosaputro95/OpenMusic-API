const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (request, h) => handler.postAlbumHandler(request, h),
    },
    {
        method: 'GET',
        path: '/albums',
        handler: () => handler.getAlbumsHandler(),
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request) => handler.getAlbumByIdHandler(request),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request, h) => handler.putAlbumByIdHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadCoverHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000,
            },
        },
    },
    {
        method: 'GET',
        path: '/albums/covers/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file/covers'),
            },
        },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postLikesAlbumHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getLikesAlbumByIdhandler,
    },
];

module.exports = routes;