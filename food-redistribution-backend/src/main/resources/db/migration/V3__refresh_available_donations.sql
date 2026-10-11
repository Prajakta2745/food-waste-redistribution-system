-- ====================================================================
-- V3: Ensure fresh, unexpired surplus donations for testing & demo
-- ====================================================================

-- Update any existing AVAILABLE donations so their validity is active
UPDATE food_donations
SET available_from = NOW() - INTERVAL '1 hour',
    available_until = NOW() + INTERVAL '30 days',
    preparation_date_time = NOW() - INTERVAL '2 hours',
    best_before_date_time = NOW() + INTERVAL '30 days',
    updated_at = NOW()
WHERE status = 'AVAILABLE';

-- Insert fresh sample donations across multiple categories & cities if not already present
INSERT INTO food_donations (provider_id, food_name, food_category, quantity, quantity_unit, food_type, preparation_date_time, best_before_date_time, description, pickup_address, city, state, contact_number, special_instructions, available_from, available_until, status, version, created_at, updated_at)
VALUES
(1, 'Gourmet Pasta & Roasted Vegetable Medley', 'COOKED_MEALS', 45.0, 'SERVINGS', 'VEGETARIAN', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '14 days', 'Freshly prepared penne pasta in tomato basil sauce with roasted zucchini, bell peppers, and parmesan.', '100 Luxury Avenue, Downtown Kitchen Dock', 'Metropolis', 'NY', '+1-555-0201', 'Packed in insulated catering containers. Keep heated or refrigerate promptly.', NOW(), NOW() + INTERVAL '14 days', 'AVAILABLE', 0, NOW(), NOW()),

(2, 'Whole Wheat Baguettes & Artisan Croissants', 'BAKERY', 30.0, 'PACKETS', 'VEGAN', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '10 days', 'Assortment of fresh rustic multigrain sourdough bread loaves and vegan almond croissants.', '45 Baker Street, West End', 'Metropolis', 'NY', '+1-555-0202', 'Store in cool dry area.', NOW(), NOW() + INTERVAL '10 days', 'AVAILABLE', 0, NOW(), NOW()),

(1, 'Executive Banquet Steamed Rice & Lentil Stew', 'COOKED_MEALS', 60.0, 'SERVINGS', 'VEGAN', NOW() - INTERVAL '3 hours', NOW() + INTERVAL '12 days', 'Nutritious yellow lentil dal curry with fragrant jeera basmati rice and roasted vegetables.', '100 Luxury Avenue, Downtown', 'Gotham', 'NJ', '+1-555-0201', 'Hot boxes ready at rear loading dock.', NOW(), NOW() + INTERVAL '12 days', 'AVAILABLE', 0, NOW(), NOW())
ON CONFLICT DO NOTHING;
