const mapAlbumsToModel = ({
    id,
    name,
    year,
    created_at,
    updated_at,
    cover_url,
}) => ({
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at,
    coverUrl: cover_url,
});

module.exports = { mapAlbumsToModel };
