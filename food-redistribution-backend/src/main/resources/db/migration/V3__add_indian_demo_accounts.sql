-- ====================================================================
-- V3: Additional Seed Data for Regional / Indian Demo Accounts
-- ====================================================================

-- 1. Additional Users
INSERT INTO users (id, name, email, password, phone, role, enabled, created_at, updated_at) VALUES
(9, 'GreenLeaf Restaurant', 'greenleaf.restaurant@gmail.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+91-9876543210', 'FOOD_PROVIDER', true, NOW(), NOW()),
(10, 'Helping Hands NGO', 'helpinghands.ngo@gmail.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+91-9876501234', 'NGO', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. Additional Food Provider Profile
INSERT INTO food_provider_profiles (id, user_id, organization_name, organization_type, address, city, state, description, verification_status, created_at, updated_at) VALUES
(3, 9, 'GreenLeaf Fine Dining Restaurant', 'RESTAURANT', 'MG Road, Deccan Gymkhana', 'Pune', 'Maharashtra', 'Pure vegetarian and authentic multicuisine restaurant.', 'APPROVED', NOW(), NOW())
ON CONFLICT DO NOTHING;

SELECT setval('food_provider_profiles_id_seq', (SELECT MAX(id) FROM food_provider_profiles));

-- 3. Additional NGO Profile
INSERT INTO ngo_profiles (id, user_id, organization_name, registration_number, contact_person, address, city, state, service_area, description, verification_status, created_at, updated_at) VALUES
(3, 10, 'Helping Hands NGO Foundation', 'NGO-IND-2022-7719', 'Pooja Sharma', '14 Karve Road, Kothrud', 'Pune', 'Maharashtra', 'Pune Metropolitan Region', 'Dedicated community food bank and daily child meal distributor.', 'VERIFIED', NOW(), NOW())
ON CONFLICT DO NOTHING;

SELECT setval('ngo_profiles_id_seq', (SELECT MAX(id) FROM ngo_profiles));
