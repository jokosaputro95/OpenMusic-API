const autoBind = require('auto-bind');

class AuthenticationsHandler {
    constructor(AuthenticationsService, UsersService, TokenManager, AuthenticationsValidator) {
        this._authenticationsService = AuthenticationsService;
        this._usersService = UsersService;
        this._tokenManager = TokenManager;
        this._authenticationsValidator = AuthenticationsValidator;

        autoBind(this);
    }

    async postAuthenticationHandler(request, h) {
        this._authenticationsValidator.validatePostAuthenticationPayload(request.payload);

        const { username, password } = request.payload;
        const id = await this._usersService.verifyUserCredential(username, password);

        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });

        await this._authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(201);
        return response;
    }

    async putAuthenticationHandler(request, h) {
        this._authenticationsValidator.validatePutAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);

        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this._tokenManager.generateAccessToken({ id });

        return h.response({
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
                accessToken,
            },
        });
    }

    async deleteAuthenticationHandler(request, h) {
        this._authenticationsValidator.validateDeleteAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        return h.response({
            status: 'success',
            message: 'Refresh token berhasil dihapus',
        });
    }
}

module.exports = AuthenticationsHandler;