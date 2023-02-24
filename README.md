# OpenMusic-API-V1
Submission Dicoding Fundamental Back-End Apps OpenMusic API Versi 1

## 5 Kriteria Utama
1. Album Data Management
    * POST /albums
    * GET /albums/{id}
    * PUT /albums/{id}
    * DELETE /albums{id}

2. Song Data Management
    * POST /songs
    * GET /songs
    * GET /songs/{id}
    * PUT /albums/{id}
    * DELETE /albums{id}

3. Validation Data Implemented
    * POST /albums
        - name: string, required,
        - year: number, requiered
    * PUT /albums
        - name: string, required,
        - year: number, requiered
    * POST /songs
        - title: string, required,
        - year: number, required,
        - genre: string, required,
        - performer: string, required,
        - duration: number,
        - albumId: string
    * PUT /songs
        - title: string, required,
        - year: number, required,
        - genre: string, required,
        - performer: string, required,
        - duration: number,
        - albumId: string

4. Error Handling Implemented
5. Using a database to store data for albums and songs using Postgresql

### Kriteria Optional
1. Brings up the track list in album details
    - endpoint: GET /albums/{albumId}
2. Query Parameter for song search
    - ?title,
    - ?performer
    * **Note:** The use of these two parameters can be combined


# OpenMusic-API-V2
Submission Dicoding Fundamental Back-End Apps OpenMusic API Versi 2

## 6 Kriteria Utama
1. Registrasi dan Authentikasi Pengguna
    * POST /users 
        - Body Request:
            - username, password, fullname: string
        - Response: 
            - status code: 201
            - data: userId: "user_id"
        - Keterangan: Menambahkan pengguna
    * POST /authentications
        - Body Request:
            - username, password: string
        - Response:
            - status code: 201
            - data: accessToken: "token", refreshToken: "token"
        - Keterangan: Autentikasi pengguna/login
    * PUT /authentications
        - Body Request:
            - refreshTOken: string
        - Response:
            - status code: 200
            - data: accessToken: "token"
        - Keterangan: Memperbaharui access token
    * DELETE /authentications
        - Body Request:
            - refreshToken: string
        - Response:
            - status code: 200
            - message: *any (nilai string apapun selama tidak kosong)
        - Keterangan: Menghapus autentikasi
        
**Ketentuan**: 
* Username harus unik
* Authentication menggunakan JWT token
* JWT token harus mengandung payload berisi **userId** yang merupakan id dari user autentik
* Nilai secret key token JWT baik access token ataupun refresh token wajib menggunakan environment variabel **ACCESS_TOKEN_KEY** dan **REFRESH_TOKEN_KEY**
* Refresh token memiliki signature yang benar serta terdaftar di didatabase

2. Pengelolaan Data Playlist
    * Endpoint
        - POST /playlists
            * Body Request:
                - name: string
            * Response:
                - status code: 201
                - data: playlistId: "playlist_id"
            * Keterangan: Menambahkan playlist
        - GET /playlists
        - DELETE /playlist/{id}
        - POST /playlists/{id}/songs
        - GET /playlists/{id}/songs
        - DELETE /playlists/{id}/songs