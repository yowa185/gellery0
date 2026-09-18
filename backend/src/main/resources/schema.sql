-- GALLERY 0: login-free marketplace schema for PostgreSQL
-- A visitor_token identifies a browser visitor without requiring an account login.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    visitor_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    display_name VARCHAR(100) NOT NULL DEFAULT 'GALLERY 0 VISITOR',
    email VARCHAR(255) UNIQUE,
    profile_image VARCHAR(1000),
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artworks (
    id BIGSERIAL PRIMARY KEY,
    seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    artist_name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(12, 0) NOT NULL CHECK (price >= 0),
    width NUMERIC(8, 2) CHECK (width > 0),
    height NUMERIC(8, 2) CHECK (height > 0),
    material VARCHAR(200),
    production_year INTEGER CHECK (production_year BETWEEN 1000 AND 9999),
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('PAINTING', 'PHOTOGRAPHY', 'OBJECT', 'VIDEO')),
    image_url VARCHAR(1000) NOT NULL,
    shipping_info VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ON_SALE'
        CHECK (status IN ('ON_SALE', 'RESERVED', 'SOLD')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchases (
    id BIGSERIAL PRIMARY KEY,
    artwork_id BIGINT NOT NULL REFERENCES artworks(id) ON DELETE RESTRICT,
    buyer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    price NUMERIC(12, 0) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED'
        CHECK (status IN ('REQUESTED', 'ACCEPTED', 'REJECTED', 'COMPLETED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artworks_seller_id ON artworks(seller_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_purchases_buyer_id ON purchases(buyer_id);
CREATE INDEX idx_purchases_artwork_id ON purchases(artwork_id);
CREATE INDEX idx_purchases_status ON purchases(status);
