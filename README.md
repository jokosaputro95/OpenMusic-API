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
            - responeCode: 201
            - data: userId: "user_id"
        - keterangan: menambahkan pengguna
    * POST /authentication
    * PUT /authentication
    * DELETE /authentication