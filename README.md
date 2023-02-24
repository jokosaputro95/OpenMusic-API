# OpenMusic-API
## Technology
* NodeJs
* JWT 
* Hapi Framework
* Postgresql

## OpenMusic-API-V1
Submission Dicoding Fundamental Back-End Apps OpenMusic API Versi 1
### 5 Kriteria Utama
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

#### Kriteria Optional
1. Brings up the track list in album details
    - endpoint: GET /albums/{albumId}
2. Query Parameter for song search
    - ?title,
    - ?performer
    * **Note:** The use of these two parameters can be combined


## OpenMusic-API-V2
Submission Dicoding Fundamental Back-End Apps OpenMusic API Versi 2
### 6 Kriteria Utama
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
            - Body Request:
                - name: string
            - Response:
                - status code: 201
                - data: playlistId: "playlist_id"
            - Keterangan: Menambahkan playlist
        - GET /playlists
            - Body Request: -
            - Response:
                - status code: 200
                - data: playlists: playlist[]
            - Keterangan: Melihat daftar playlist yang dimiliki
        - DELETE /playlist/{id}
            - Body Request: -
            - Response: 
                - status code: 200
                - message: *any (nilai string apapun selama tidak kosong)
        - POST /playlists/{id}/songs
            - Body Request:
                - songId: string
            - Response:
                - status code: 201
                - message: *any (nilai string apapun selama tidak kosong)
            - Keterangan: Menambahkan lagu ke playlist
        - GET /playlists/{id}/songs
            - Body Request: -
            - Response: 
                - status code: 200
                - data: playlist: playlist
            - Keterangan: Melihat daftar lagu di dalam playlist
        - DELETE /playlists/{id}/songs
            - Body Request:
                songId: string
            - Response:
                - status code: 200
                - message: *any (nilai string apapun selama tidak kosong)
            - Keterangan: Mengapus lagu dari playlist

**Ketentuan**:
* Playlist merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token.
* Playlist yang muncul pada **GET /playlists** hanya yang ia miliki saja.
* Hanya owner playlist (atau kolabolator) yang dapat menambahkan, melihat, dan menghapus lagu ke/dari playlist.
* **songId** dimasukkan/dihapus ke/dari playlist wajib bernilai id lagu yang valid.
* Properti **owner** merupakan user id dari pembuat playlist. Anda bisa mendapatkan nilainya melalui artifacts payload JWT.

3. Menerapkan Foreign Key
    - Tabel songs terhadap albums;
    - Tabel playlist terhadap users;
    - dan relasi tabel lainnya.

4. Menerapkan Data Validation
    - POST /users:
        - username : string, required.
        - password : string, required.
        - fullname : string, required.
    - POST /authentications:
        - username : string, required.
        - password : string, required.
    - PUT /authentications:
        - refreshToken : string, required.
    - DELETE /authentications:
        - refreshToken : string, required.
    - POST /playlists:
        - name : string, required.
    - POST /playlists/{playlistId}/songs
        - songId : string, required.

5. Penanganan Eror (*Error Handling*)
    - Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:
        - status code: **400 (Bad Request)**
        - response body:
            - status: **fail**
            - message: *any (apapun selama tidak kosong)
    - Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:
        - status code: **404 (Not Found)**
        - response body:
            - status: **fail**
            - message: *any (apapun selama tidak kosong)
    - Ketika pengguna mengakses resource yang dibatasi tanpa access token, server harus mengembalikan response:
        - status code: **401 (Unauthorized)**
        - response body:
            - status: **fail**
            - message: *any (apapun selama tidak kosong)
    - Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:
        - status code: **400 (Bad Request)**
        - response body:
            - status: **fail**
            - message: *any (apapun selama tidak kosong)
    - Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:
        - status code: **403 (Forbidden)**
        - response body:
            - status: **fail**
            - message: *any (apapun selama tidak kosong)
    - Ketika terjadi server eror, server harus mengembalikan response:
        - status code: **500 (Internal Server Error)**
        - response body:
            - status: **error**
            - message: *any (apapun selama tidak kosong)

6. Pertahankan Fitur OpenMusic API V1
    * Pengelolaan data album
    * Pengelolaan data song
    * Menerapkan data validations resource album dan song

#### Kriteria Opsional
1. Memiliki fitur kolaborator playlist
    - Endpoint
        - POST /collaborations
            - Body Request:
                - playlistId: string
                - userId: string
            - Response:
                - status code: 201
                - body:
                    - data: collaborationId: "collab_id"
            - Keterangan: Menambahkan kolabortor playlist
        - DELETE /collaborations
            - Body Request;
                - playlistId: string
                - userId: string
            - Response:
                - status code: 200
                - body:
                    - message: *any (nilai string apapun selama tidak kosong)

**Hak akses kolaborator**:
* Playlist tampil pada permintaan **GET /playlists**.
* Dapat menambahkan lagu ke dalam playlist.
* Dapat menghapus lagu dari playlist.
* Dapat melihat daftar lagu yang ada di playlist.
* Dapat melihat aktifitas playlist (jika menerapkan kriteria opsional ke-2).

2. Memiliki fitur playlist activities
    - GET /playlists/{id}/activities
        - Response:
            - status code: 200
            - body:
                - data: {}

3. Mempertahankan Kriteria Opsional OpenMusic V1
    - Mendapatkan daftar lagu di dalam album detail
    - Query Parameter untuk pencarian lagu