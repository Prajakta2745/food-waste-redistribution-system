# Food Waste Redistribution System (FoodShare)

> A production-style, full-stack web application engineered to bridge the gap between commercial surplus food and charitable relief distribution.

[![Java](https://img.shields.io/badge/Java-21-orange.svg?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-6.x%20(JWT)-green.svg?style=flat-square&logo=springsecurity)](https://spring.io/projects/spring-security)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-Migrations-red.svg?style=flat-square&logo=flyway)](https://flywaydb.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 📌 Problem Statement & Solution

### The Problem
Commercial food establishments (restaurants, hotels, banquet halls, corporate canteens, bakeries) generate tons of freshly prepared, wholesome edible food daily that remains unserved. Simultaneously, millions of underserved individuals in local communities experience chronic food insecurity. Lack of real-time discovery, verification, and dispatch coordination results in tragic food wastage.

### The Solution
**FoodShare** provides an enterprise-grade, real-time coordination platform that empowers Food Providers to list surplus food with strict dietary tags and best-before deadlines. Verified NGOs can claim batches with **optimistic concurrency control** (preventing double claims), dispatch verified volunteer drivers for pickup, and verify receipt with complete audit trails.

---

## 🏛️ System Architecture

```
React 18 + Vite + Tailwind CSS (Client SPA)
                     │
                     │ HTTPS / REST JSON + Bearer JWT
                     ▼
 Spring Boot 3.x Security Filter Chain (JwtAuthenticationFilter)
                     │
                     ▼
          REST Controllers Layer
                     │
                     ▼
        Service Layer (@Transactional)
                     │
                     ▼
      Spring Data JPA Repositories Layer
                     │
                     ▼
       PostgreSQL (food_redistribution_db)
```

---

## 👥 User Roles & Core Capabilities

| Role | Description | Key Capabilities |
| :--- | :--- | :--- |
| **FOOD_PROVIDER** | Restaurants, Hotels, Canteens, Caterers, Bakeries | • Register & manage establishment profile<br>• Post surplus food batches with dietary tags, volume, and deadlines<br>• Edit available batches prior to claim<br>• Track live pickup progress & assigned volunteer |
| **NGO** | Verified Charitable Foundations, Food Banks | • Browse & filter available food batches in real-time<br>• Concurrency-safe claiming of available donations<br>• Assign verified volunteer drivers for collection<br>• Inspect & confirm delivery receipt to complete lifecycle |
| **VOLUNTEER** | Registered Delivery Drivers | • Manage availability (`AVAILABLE`, `BUSY`, `UNAVAILABLE`)<br>• Review assigned tasks with pickup/drop-off addresses & instructions<br>• Accept / decline task assignments<br>• Transition pickup status (`PICKED_UP` $\rightarrow$ `DELIVERED`) |
| **ADMIN** | System Administrators | • System metrics & platform analytics<br>• Verify or reject registered NGO applications<br>• Verify or reject Volunteer applications<br>• Enable / disable user access accounts<br>• Full system audit trail & live logistics monitor |

---

## 🔄 End-to-End Redistribution Workflow

```
[Food Provider] Creates Donation (Status: AVAILABLE)
       │
       ▼
[NGO] Searches & Filters Available Food (City, Category, Diet Type)
       │
       ▼
[NGO] Claims Donation (Atomic DB Transition: AVAILABLE ➔ ACCEPTED)
       │ (Pickup Requirement Auto-Created in Status: PENDING)
       │
       ▼
[NGO] Dispatches Verified Volunteer (Pickup Status: ASSIGNED)
       │
       ▼
[Volunteer] Accepts Pickup Assignment (Pickup Status: ACCEPTED)
       │
       ▼
[Volunteer] Collects Food at Provider Dock (Status: PICKED_UP)
       │
       ▼
[Volunteer] Delivers Food to NGO Shelter (Status: DELIVERED)
       │
       ▼
[NGO] Inspects & Confirms Food Received (Status: COMPLETED)
```

---

## 🛠️ Technology Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.4
- **Security**: Spring Security 6, JJWT (0.12.5) for Stateless JWT Authentication & BCrypt Password Hashing
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: PostgreSQL
- **Migration**: Flyway (`V1__create_tables.sql`, `V2__seed_demo_data.sql`)
- **Validation**: Jakarta Bean Validation (`@NotBlank`, `@NotNull`, `@Positive`, etc.)
- **Documentation**: SpringDoc OpenAPI 3.0 / Swagger UI
- **Testing**: JUnit 5, Mockito, Spring Security Test

### Frontend
- **Framework**: React 18 (Vite SPA)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with automated Bearer token interceptor and 401 response handling
- **Routing**: React Router DOM (v6) with Protected Route Guards
- **State Management**: React Context API (`AuthContext`, `NotificationContext`)

---

## 🗄️ Database Table Schema

1. `users` — Base user credentials, role, status, timestamps.
2. `food_provider_profiles` — Restaurant/hotel details, establishment type, location.
3. `ngo_profiles` — Registered charity name, government reg. number, service area, verification status.
4. `volunteer_profiles` — Driver vehicle classification, plate number, live availability status.
5. `food_donations` — Surplus food details, volume, timestamps, and optimistic locking version.
6. `donation_requests` — Historical claims submitted by NGOs.
7. `pickups` — Logistics fulfillment tracker connecting donor, NGO, and driver with milestone timestamps.
8. `notifications` — In-app notification alerts for state updates and verification notices.
9. `audit_logs` — Immutable audit log recording all system events.

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Java 21 JDK** installed
- **Maven 3.9+** installed
- **Node.js 18+ & npm** installed
- **PostgreSQL 15+** running on `localhost:5432`

---

### Step 1: Database Setup
Create the PostgreSQL database:
```sql
CREATE DATABASE food_redistribution_db;
```

---

### Step 2: Backend Configuration & Startup
Navigate to `food-redistribution-backend`:
```bash
cd food-redistribution-backend
```

Configure your PostgreSQL credentials in `src/main/resources/application.properties` (or export environment variables):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/food_redistribution_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Build and run the Spring Boot application:
```bash
mvn clean spring-boot:run
```
> **Note**: Flyway will automatically execute database migrations (`V1` and `V2`) on startup, creating all tables and seeding demo accounts.

Backend will be live at: `http://localhost:8080`  
Interactive Swagger API documentation: `http://localhost:8080/swagger-ui.html`

---

### Step 3: Frontend Startup
In a separate terminal, navigate to `food-redistribution-frontend`:
```bash
cd food-redistribution-frontend
npm install
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

## 🔑 Seed Demo Login Credentials

All demo accounts share the default password: **`Password@123`**

| Role | Email | Organization / Name | Notes |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@foodshare.org` | System Admin | Full system governance |
| **FOOD_PROVIDER** | `provider1@grandhotel.com` | Grand Palace Hotel | 5-star Hotel Donor |
| **FOOD_PROVIDER** | `provider2@citybakery.com` | City Fresh Bakery | Artisanal Bakery Donor |
| **NGO** | `ngo1@feedinghope.org` | Feeding Hope Foundation | Verified NGO |
| **NGO** | `ngo2@hungeraid.org` | Hunger Relief Society | Pending NGO (for Admin verification demo) |
| **VOLUNTEER** | `volunteer1@gmail.com` | Alex Rivers | Verified Car Driver |
| **VOLUNTEER** | `volunteer2@gmail.com` | Maria Santos | Verified Van Driver |
| **VOLUNTEER** | `volunteer3@gmail.com` | David Chen | Pending Driver (for Admin verification demo) |

> 💡 **Quick Login**: The Login page features 1-click credential buttons to quickly sign in as any role.

---

## 🧪 Automated Testing

Execute the JUnit 5 test suite covering authentication, donation lifecycle, concurrency guards, and driver status updates:
```bash
cd food-redistribution-backend
mvn test
```

---

## 🔮 Future Enhancements
- Real-time GPS driver tracking via WebSockets and Mapbox/Leaflet integration.
- Automated SMS/WhatsApp notifications for urgent meal expiration alerts.
- Cold-chain temperature logging integration via IoT temperature sensors.
- Machine Learning models predicting donation surge hours based on catering calendars.
