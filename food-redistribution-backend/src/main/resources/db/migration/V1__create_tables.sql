-- ====================================================================
-- V1: Core Tables for Food Waste Redistribution System (PostgreSQL)
-- ====================================================================

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. FOOD PROVIDER PROFILES TABLE
CREATE TABLE food_provider_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    organization_name VARCHAR(150) NOT NULL,
    organization_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    description TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_provider_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_provider_city ON food_provider_profiles(city);

-- 3. NGO PROFILES TABLE
CREATE TABLE ngo_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    organization_name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    contact_person VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    service_area VARCHAR(200) NOT NULL,
    description TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ngo_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_ngo_city ON ngo_profiles(city);
CREATE INDEX idx_ngo_verification ON ngo_profiles(verification_status);

-- 4. VOLUNTEER PROFILES TABLE
CREATE TABLE volunteer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_number VARCHAR(50),
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_volunteer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_volunteer_city ON volunteer_profiles(city);
CREATE INDEX idx_volunteer_availability ON volunteer_profiles(availability_status);
CREATE INDEX idx_volunteer_verification ON volunteer_profiles(verification_status);

-- 5. FOOD DONATIONS TABLE
CREATE TABLE food_donations (
    id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    food_category VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    quantity_unit VARCHAR(30) NOT NULL,
    food_type VARCHAR(30) NOT NULL,
    preparation_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    best_before_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    pickup_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    special_instructions TEXT,
    available_from TIMESTAMP WITH TIME ZONE NOT NULL,
    available_until TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_provider FOREIGN KEY (provider_id) REFERENCES food_provider_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_donations_status ON food_donations(status);
CREATE INDEX idx_donations_city ON food_donations(city);
CREATE INDEX idx_donations_category ON food_donations(food_category);
CREATE INDEX idx_donations_food_type ON food_donations(food_type);
CREATE INDEX idx_donations_available_until ON food_donations(available_until);

-- 6. DONATION REQUESTS TABLE
CREATE TABLE donation_requests (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    ngo_id BIGINT NOT NULL,
    request_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejection_reason VARCHAR(255),
    CONSTRAINT fk_request_donation FOREIGN KEY (donation_id) REFERENCES food_donations(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_ngo FOREIGN KEY (ngo_id) REFERENCES ngo_profiles(id) ON DELETE CASCADE,
    CONSTRAINT uq_donation_ngo UNIQUE(donation_id, ngo_id)
);

CREATE INDEX idx_requests_donation_id ON donation_requests(donation_id);
CREATE INDEX idx_requests_ngo_id ON donation_requests(ngo_id);

-- 7. PICKUPS TABLE
CREATE TABLE pickups (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL UNIQUE,
    ngo_id BIGINT NOT NULL,
    volunteer_id BIGINT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pickup_donation FOREIGN KEY (donation_id) REFERENCES food_donations(id) ON DELETE CASCADE,
    CONSTRAINT fk_pickup_ngo FOREIGN KEY (ngo_id) REFERENCES ngo_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_pickup_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteer_profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_pickups_ngo ON pickups(ngo_id);
CREATE INDEX idx_pickups_volunteer ON pickups(volunteer_id);
CREATE INDEX idx_pickups_status ON pickups(status);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read);

-- 9. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
