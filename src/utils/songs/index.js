const mapSongsToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    album_id,
    created_at,
    updated_at,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId: album_id,
    createdAt: created_at,
    updatedAt: updated_at,
});

module.exports = { mapSongsToModel };