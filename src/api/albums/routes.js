const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler:(request, h) => handler.postAlbumHandler(request, h),
    },
    {
        method: 'GET',
        path: '/albums',
        handler:() => handler.getAlbumsHandler(),
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler:(request, h) => handler.getAlbumByIdHandler(request),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler:(request, h) => handler.putAlbumByIdHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler:(request, h) => handler.deleteAlbumByIdHandler(request, h),
    },
];

module.exports = routes;