-- ====================================================================
-- V2: Seed Data for Food Waste Redistribution System
-- Passwords are all: Password@123 (BCrypt: $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa)
-- ====================================================================

-- 1. SEED USERS
INSERT INTO users (id, name, email, password, phone, role, enabled, created_at, updated_at) VALUES
(1, 'System Admin', 'admin@foodshare.org', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0100', 'ADMIN', true, NOW(), NOW()),
(2, 'Grand Palace Hotel', 'provider1@grandhotel.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0201', 'FOOD_PROVIDER', true, NOW(), NOW()),
(3, 'City Fresh Bakery', 'provider2@citybakery.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0202', 'FOOD_PROVIDER', true, NOW(), NOW()),
(4, 'Feeding Hope Foundation', 'ngo1@feedinghope.org', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0301', 'NGO', true, NOW(), NOW()),
(5, 'Hunger Relief Society', 'ngo2@hungeraid.org', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0302', 'NGO', true, NOW(), NOW()),
(6, 'Alex Rivers', 'volunteer1@gmail.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0401', 'VOLUNTEER', true, NOW(), NOW()),
(7, 'Maria Santos', 'volunteer2@gmail.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0402', 'VOLUNTEER', true, NOW(), NOW()),
(8, 'David Chen', 'volunteer3@gmail.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '+1-555-0403', 'VOLUNTEER', true, NOW(), NOW());

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. SEED PROVIDER PROFILES
INSERT INTO food_provider_profiles (id, user_id, organization_name, organization_type, address, city, state, description, verification_status, created_at, updated_at) VALUES
(1, 2, 'Grand Palace Hotel & Banquets', 'HOTEL', '100 Luxury Avenue, Downtown', 'Metropolis', 'NY', '5-star hotel with banquet halls frequently hosting conferences and weddings.', 'APPROVED', NOW(), NOW()),
(2, 3, 'City Fresh Artisan Bakery', 'BAKERY', '45 Baker Street, West End', 'Metropolis', 'NY', 'Daily fresh artisanal bakery producing organic sourdough breads, croissants, and pastries.', 'APPROVED', NOW(), NOW());

SELECT setval('food_provider_profiles_id_seq', (SELECT MAX(id) FROM food_provider_profiles));

-- 3. SEED NGO PROFILES
INSERT INTO ngo_profiles (id, user_id, organization_name, registration_number, contact_person, address, city, state, service_area, description, verification_status, created_at, updated_at) VALUES
(1, 4, 'Feeding Hope Foundation', 'NGO-USA-2021-9981', 'Sarah Jenkins', '78 Community Road, Northside', 'Metropolis', 'NY', 'Metro North & Central District', 'Non-profit operating 3 soup kitchens and delivering hot meals to homeless shelters.', 'VERIFIED', NOW(), NOW()),
(2, 5, 'Hunger Relief Society', 'NGO-USA-2023-4412', 'Michael Ross', '22 Charity Way, East End', 'Metropolis', 'NY', 'East District & Riverside', 'Community food pantry distributing food kits and fresh surplus meals to impoverished families.', 'PENDING', NOW(), NOW());

SELECT setval('ngo_profiles_id_seq', (SELECT MAX(id) FROM ngo_profiles));

-- 4. SEED VOLUNTEER PROFILES
INSERT INTO volunteer_profiles (id, user_id, address, city, state, vehicle_type, vehicle_number, availability_status, verification_status, created_at, updated_at) VALUES
(1, 6, '12 Maple Court', 'Metropolis', 'NY', 'CAR', 'NY-882-VOL', 'AVAILABLE', 'VERIFIED', NOW(), NOW()),
(2, 7, '305 Pine Ridge Lane', 'Metropolis', 'NY', 'VAN', 'NY-551-CARGO', 'AVAILABLE', 'VERIFIED', NOW(), NOW()),
(3, 8, '88 Elm Street', 'Metropolis', 'NY', 'BIKE', 'NY-BK-409', 'AVAILABLE', 'PENDING', NOW(), NOW());

SELECT setval('volunteer_profiles_id_seq', (SELECT MAX(id) FROM volunteer_profiles));

-- 5. SEED FOOD DONATIONS
INSERT INTO food_donations (id, provider_id, food_name, food_category, quantity, quantity_unit, food_type, preparation_date_time, best_before_date_time, description, pickup_address, city, state, contact_number, special_instructions, available_from, available_until, status, version, created_at, updated_at) VALUES
(1, 1, 'Buffet Lunch Surplus - Steamed Rice & Veggie Curries', 'COOKED_MEALS', 35.0, 'SERVINGS', 'VEGETARIAN', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '6 hours', 'Nutritious lunch meal trays with basmati rice, mixed vegetable curry, and lentil dal.', '100 Luxury Avenue, Downtown Kitchen Dock', 'Metropolis', 'NY', '+1-555-0201', 'Packed in insulated thermal boxes. Keep warm.', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '5 hours', 'AVAILABLE', 0, NOW(), NOW()),

(2, 2, 'Fresh Sourdough Loaves & Croissants', 'BAKERY', 25.0, 'PACKETS', 'VEGETARIAN', NOW() - INTERVAL '4 hours', NOW() + INTERVAL '24 hours', 'Freshly baked morning sourdough baguettes, whole wheat bread, and butter croissants.', '45 Baker Street, West End', 'Metropolis', 'NY', '+1-555-0202', 'Store in dry area at room temperature.', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '12 hours', 'AVAILABLE', 0, NOW(), NOW()),

(3, 1, 'Grilled Herb Chicken & Roasted Potatoes', 'COOKED_MEALS', 50.0, 'SERVINGS', 'NON_VEGETARIAN', NOW() - INTERVAL '3 hours', NOW() + INTERVAL '5 hours', 'Surplus executive lunch trays: Herb grilled chicken breasts with rosemary potatoes and sautéed beans.', '100 Luxury Avenue, Downtown Kitchen Dock', 'Metropolis', 'NY', '+1-555-0201', 'Refrigerated or thermal carrier recommended.', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '4 hours', 'PICKUP_ASSIGNED', 0, NOW(), NOW()),

(4, 1, 'Continental Breakfast Pastries & Fresh Fruit Bowls', 'COOKED_MEALS', 40.0, 'SERVINGS', 'VEGETARIAN', NOW() - INTERVAL '28 hours', NOW() - INTERVAL '20 hours', 'Surplus morning breakfast spreads with fresh diced melons, pineapple bowls and muffins.', '100 Luxury Avenue, Downtown', 'Metropolis', 'NY', '+1-555-0201', 'Delivered safely and distributed to shelter residents.', NOW() - INTERVAL '27 hours', NOW() - INTERVAL '22 hours', 'COMPLETED', 0, NOW() - INTERVAL '28 hours', NOW() - INTERVAL '20 hours'),

(5, 2, 'Assorted Savory Puff Pastries & Bagels', 'BAKERY', 30.0, 'PACKETS', 'VEGAN', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '10 hours', 'Vegan spinach potato rolls, whole wheat sesame bagels, and fruit tarts.', '45 Baker Street, West End', 'Metropolis', 'NY', '+1-555-0202', 'Packed in clean cardboard boxes.', NOW(), NOW() + INTERVAL '8 hours', 'AVAILABLE', 0, NOW(), NOW());

SELECT setval('food_donations_id_seq', (SELECT MAX(id) FROM food_donations));

-- 6. SEED DONATION REQUESTS
INSERT INTO donation_requests (id, donation_id, ngo_id, request_status, requested_at, accepted_at) VALUES
(1, 3, 1, 'ACCEPTED', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes'),
(2, 4, 1, 'ACCEPTED', NOW() - INTERVAL '26 hours', NOW() - INTERVAL '25 hours 30 minutes');

SELECT setval('donation_requests_id_seq', (SELECT MAX(id) FROM donation_requests));

-- 7. SEED PICKUPS
INSERT INTO pickups (id, donation_id, ngo_id, volunteer_id, pickup_address, delivery_address, status, notes, assigned_at, accepted_at, picked_up_at, delivered_at, completed_at, created_at, updated_at) VALUES
(1, 3, 1, 1, '100 Luxury Avenue, Downtown Kitchen Dock, Metropolis, NY', '78 Community Road, Northside, Metropolis, NY', 'ASSIGNED', 'Please use rear dock service elevator at hotel.', NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour 15 minutes', NULL, NULL, NULL, NOW() - INTERVAL '1 hour 45 minutes', NOW()),
(2, 4, 1, 2, '100 Luxury Avenue, Downtown, Metropolis, NY', '78 Community Road, Northside, Metropolis, NY', 'COMPLETED', 'Smooth pickup and fast distribution at soup kitchen.', NOW() - INTERVAL '25 hours', NOW() - INTERVAL '24 hours 45 minutes', NOW() - INTERVAL '24 hours 15 minutes', NOW() - INTERVAL '23 hours 30 minutes', NOW() - INTERVAL '23 hours 15 minutes', NOW() - INTERVAL '25 hours 30 minutes', NOW() - INTERVAL '23 hours 15 minutes');

SELECT setval('pickups_id_seq', (SELECT MAX(id) FROM pickups));

-- 8. SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, read, created_at) VALUES
(1, 4, 'Account Verified', 'Welcome to FoodShare! Your NGO profile has been verified by the Admin.', 'SYSTEM', true, NOW() - INTERVAL '3 days'),
(2, 2, 'Donation Claimed', 'Feeding Hope Foundation has accepted your donation: Grilled Herb Chicken & Roasted Potatoes.', 'DONATION_STATUS', false, NOW() - INTERVAL '1 hour 45 minutes'),
(3, 6, 'New Pickup Assignment', 'You have been assigned to pick up food from Grand Palace Hotel and deliver to Feeding Hope Foundation.', 'PICKUP_UPDATE', false, NOW() - INTERVAL '1 hour 30 minutes'),
(4, 1, 'New NGO Pending Verification', 'Hunger Relief Society has registered and is awaiting verification.', 'SYSTEM', false, NOW() - INTERVAL '2 hours');

SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

-- 9. SEED AUDIT LOGS
INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, description, timestamp) VALUES
(1, 1, 'VERIFY_NGO', 'NGO_PROFILE', 1, 'Admin verified NGO: Feeding Hope Foundation', NOW() - INTERVAL '3 days'),
(2, 2, 'CREATE_DONATION', 'FOOD_DONATION', 1, 'Grand Palace Hotel created donation: Buffet Lunch Surplus', NOW() - INTERVAL '2 hours'),
(3, 4, 'ACCEPT_DONATION', 'FOOD_DONATION', 3, 'Feeding Hope Foundation accepted donation #3', NOW() - INTERVAL '1 hour 45 minutes'),
(4, 4, 'ASSIGN_VOLUNTEER', 'PICKUP', 1, 'Assigned volunteer Alex Rivers to Pickup #1', NOW() - INTERVAL '1 hour 30 minutes');

SELECT setval('audit_logs_id_seq', (SELECT MAX(id) FROM audit_logs));
