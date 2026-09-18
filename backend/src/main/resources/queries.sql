-- GALLERY 0: reference queries for each page/feature
-- Named params (:param) match Spring's NamedParameterJdbcTemplate / JPA native @Query style.

-- ============================================================
-- HOME (index.html) — "NEW ARRIVALS" preview
-- Latest artworks currently on sale, small set for the homepage grid.
-- ============================================================
SELECT a.id, a.title, a.price, a.image_url, a.category, a.artist_name
FROM artworks a
WHERE a.status = 'ON_SALE'
ORDER BY a.created_at DESC
LIMIT :limit;                              -- e.g. :limit = 2


-- ============================================================
-- COLLECTION (collection.html) — full listing with category filter
-- category filter is optional: pass NULL (or 'all') to skip it.
-- ============================================================
SELECT a.id, a.title, a.price, a.image_url, a.category, a.status,
       a.production_year, a.artist_name
FROM artworks a
WHERE (:category = 'all' OR a.category = :category)
ORDER BY a.created_at DESC;


-- ============================================================
-- ARTWORK DETAIL (artwork.html) — single artwork + artist info
-- ============================================================
SELECT a.id, a.title, a.description, a.price, a.width, a.height,
       a.material, a.production_year, a.category, a.image_url, a.shipping_info, a.status,
       a.artist_name, u.id AS seller_id, u.profile_image AS seller_image
FROM artworks a
JOIN users u ON u.id = a.seller_id
WHERE a.id = :artworkId;


-- ============================================================
-- SELL (sell.html) — register a new artwork
-- seller_id resolved beforehand from the visitor's UUID (see visitor lookup below).
-- ============================================================
INSERT INTO artworks
    (seller_id, title, artist_name, description, price, width, height, material,
     production_year, category, image_url, shipping_info)
VALUES
    (:sellerId, :title, :artistName, :description, :price, :width, :height, :material,
     :productionYear, :category, :imageUrl, :shippingInfo)
RETURNING id;


-- ============================================================
-- VISITOR LOOKUP / CREATE — login-free identity via visitor_token (UUID in a cookie)
-- ============================================================
-- fetch existing visitor
SELECT id, display_name, email FROM users WHERE visitor_token = :visitorToken;

-- create on first visit
INSERT INTO users (visitor_token) VALUES (:visitorToken) RETURNING id;


-- ============================================================
-- PURCHASE REQUEST (artwork.html "購入をリクエスト") — buyer requests to buy
-- Only allowed while the artwork is still ON_SALE; price is copied at request time.
-- ============================================================
INSERT INTO purchases (artwork_id, buyer_id, price)
SELECT a.id, :buyerId, a.price
FROM artworks a
WHERE a.id = :artworkId AND a.status = 'ON_SALE'
RETURNING id;

-- move the artwork to RESERVED once a purchase request is created
UPDATE artworks SET status = 'RESERVED', updated_at = CURRENT_TIMESTAMP
WHERE id = :artworkId AND status = 'ON_SALE';


-- ============================================================
-- PURCHASE DECISION — seller accepts/rejects, or completes a sale
-- ============================================================
-- seller accepts a request
UPDATE purchases SET status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP
WHERE id = :purchaseId;

-- seller rejects a request -> release the artwork back to sale
UPDATE purchases SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
WHERE id = :purchaseId;

UPDATE artworks SET status = 'ON_SALE', updated_at = CURRENT_TIMESTAMP
WHERE id = :artworkId AND status = 'RESERVED';

-- completed sale
UPDATE purchases SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
WHERE id = :purchaseId;

UPDATE artworks SET status = 'SOLD', updated_at = CURRENT_TIMESTAMP
WHERE id = :artworkId;


-- ============================================================
-- MY COLLECTION — a buyer's own purchase history (for a "마이페이지"-style view)
-- ============================================================
SELECT p.id AS purchase_id, p.status AS purchase_status, p.price, p.created_at,
       a.id AS artwork_id, a.title, a.image_url, a.artist_name
FROM purchases p
JOIN artworks a ON a.id = p.artwork_id
WHERE p.buyer_id = :buyerId
ORDER BY p.created_at DESC;


-- ============================================================
-- SELLER DASHBOARD — incoming purchase requests on a seller's own artworks
-- ============================================================
SELECT p.id AS purchase_id, p.status AS purchase_status, p.created_at,
       a.id AS artwork_id, a.title, a.image_url,
       b.display_name AS buyer_name
FROM purchases p
JOIN artworks a ON a.id = p.artwork_id
JOIN users b ON b.id = p.buyer_id
WHERE a.seller_id = :sellerId
ORDER BY p.created_at DESC;
