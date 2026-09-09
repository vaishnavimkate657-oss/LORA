# TripPartner — Full-Stack Travel Companion Platform

A modern full-stack web application engineered around the high-fidelity **TripPartner** design system created in Stitch. TripPartner enables solo adventurers, digital nomads, and travel duos to explore curated destinations, find ID-verified travel companions, coordinate collaborative day-by-day itineraries, and transparently split trip expenses.

---

## Technology Stack

- **Frontend**:
  - React 18
  - Vite
  - Tailwind CSS (Aerodynamics glassmorphic travel design system)
  - React Router v6
  - Axios (with Bearer JWT request interceptor & 401 redirect)
  - Google Material Symbols Outlined & Plus Jakarta Sans typography
- **Backend**:
  - Spring Boot 3.3.x
  - Java 17
  - Spring Security + JJWT 0.12.x
  - Spring Data JPA (Hibernate)
  - Microsoft SQL Server (MSSQL) dialect
  - Flyway Database Migration
- **Database**:
  - Microsoft SQL Server (MSSQL)
  - Version-controlled Flyway schema under `/database/migrations`

---

## Project Structure

```
trippartner/
├── frontend/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Button, Modal, Input, Badge, Spinner
│   │   │   └── layout/           # Navbar, Footer, Layout
│   │   ├── pages/
│   │   │   ├── Home/             # Full landing experience from Stitch
│   │   │   ├── Explore/          # Mood & style category browser
│   │   │   ├── Destinations/     # Destination catalog, search & details
│   │   │   ├── TravelPartners/   # Travel buddy matching hub & requests
│   │   │   ├── TripPlanner/      # Itinerary builder & live budget auto-splitter
│   │   │   ├── OpenTrips/        # Co-hosted open expeditions & spot booking
│   │   │   ├── Auth/             # Login & Register with JWT token storage
│   │   │   └── AboutUs/          # Mission, guidelines, and safety protocol
│   │   ├── routes/               # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── services/             # apiClient.js + modular API services
│   │   ├── context/              # AuthContext.jsx
│   │   ├── hooks/                # useAuth.js
│   │   ├── utils/                # tokenStorage.js, formatters.js
│   │   └── constants/            # apiEndpoints.js, theme.js
│   ├── tailwind.config.js        # Stitch aerodynamic palette & typography
│   ├── vite.config.js            # Proxy to http://localhost:8080
│   └── package.json
│
├── backend/                      # Spring Boot 3 & Java 17 Backend
│   ├── src/main/java/com/yourorg/appname/
│   │   ├── config/               # SecurityConfig, CorsConfig
│   │   ├── controller/           # AuthController, DestinationController, PartnerController, TripController, ExpeditionController
│   │   ├── dto/                  # Request & Response DTOs
│   │   ├── entity/               # User, Destination, Trip, ItineraryItem, TripExpense, PartnerPost, GroupExpedition, etc.
│   │   ├── exception/            # GlobalExceptionHandler, ResourceNotFoundException
│   │   ├── mapper/               # EntityDtoMapper
│   │   ├── repository/           # Spring Data JPA repositories
│   │   ├── security/             # JwtUtil, JwtAuthFilter, CustomUserDetailsService, UserPrincipal
│   │   ├── service/              # Service interfaces & implementations
│   │   └── Application.java      # Main entry point
│   ├── src/main/resources/
│   │   ├── application.properties# MSSQL, JPA, Flyway, JWT configuration
│   │   └── db/migration/         # Classpath Flyway migration V1__init_schema.sql
│   └── pom.xml
│
├── database/
│   └── migrations/
│       └── V1__init_schema.sql   # Flyway version-controlled schema & seed data
│
└── README.md
```

---

## Getting Started

### 1. Database Setup (Microsoft SQL Server)

The application is configured to connect to a local MSSQL instance named `trippartner_db`.

#### Option A: Quick Docker Container (Recommended)

Run the official Microsoft SQL Server container with one command:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrongPassword#123" -p 1433:1433 --name mssql-trippartner -d mcr.microsoft.com/mssql/server:2022-latest
```

Create the `trippartner_db` database using `sqlcmd` or Azure Data Studio / SSMS:

```bash
docker exec -it mssql-trippartner /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrongPassword#123" -C -Q "CREATE DATABASE trippartner_db;"
```

#### Option B: Local Native MSSQL Server

If you have SQL Server / SQL Server Express installed locally:
1. Open SSMS or Azure Data Studio.
2. Execute:
   ```sql
   CREATE DATABASE trippartner_db;
   ```
3. Update `backend/src/main/resources/application.properties` with your credentials:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=trippartner_db;encrypt=true;trustServerCertificate=true
   spring.datasource.username=sa
   spring.datasource.password=YourStrongPassword#123
   ```

*Note: Flyway will automatically execute `V1__init_schema.sql` on startup, creating all tables and pre-populating all seed destinations, wanderers, open expeditions, and trips from the design!*

---

### 2. Running the Backend

From the project root:

```bash
cd backend
mvn spring-boot:run
```

Or using Maven wrapper:
```bash
.\mvnw.cmd spring-boot:run
```

The Spring Boot application will start on **`http://localhost:8080`**.

#### Pre-seeded Demo Credentials

You can log in with any of these pre-seeded accounts:
- **Email:** `demo@trippartner.com` | **Password:** `password123` (Alex Mercer - Verified Nomad)
- **Email:** `ananya@trippartner.com` | **Password:** `password123` (Ananya Sharma - Hampta Pass Trekker)
- **Email:** `marcus@trippartner.com` | **Password:** `password123` (Marcus Vance - Remote Nomad)

---

### 3. Running the Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

The frontend will start with Vite hot reload and is pre-configured to proxy API requests to `http://localhost:8080`.

---

## API Endpoints Reference

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new traveler account | No |
| **Auth** | `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| **Auth** | `GET` | `/api/auth/me` | Get authenticated traveler profile | Yes (Bearer) |
| **Destinations** | `GET` | `/api/destinations` | List destinations (with search & category filter) | No |
| **Destinations** | `GET` | `/api/destinations/trending` | List trending wanderlust spots | No |
| **Destinations** | `POST` | `/api/destinations` | Add a new destination | Yes (Bearer) |
| **Partners** | `GET` | `/api/partners` | Browse travel companion postings | No |
| **Partners** | `POST` | `/api/partners` | Post a travel partner request | Yes (Bearer) |
| **Partners** | `POST` | `/api/partners/connect` | Send companion connect request | Yes (Bearer) |
| **Trips** | `GET` | `/api/trips` | List all planned itineraries | No |
| **Trips** | `POST` | `/api/trips` | Create a new trip plan | Yes (Bearer) |
| **Trips** | `POST` | `/api/trips/{id}/itinerary` | Add a day stop milestone | Yes (Bearer) |
| **Trips** | `POST` | `/api/trips/{id}/expenses` | Add an expense for budget splitter | Yes (Bearer) |
| **Expeditions** | `GET` | `/api/expeditions` | List confirmed group expeditions | No |
| **Expeditions** | `POST` | `/api/expeditions/join` | Join an open expedition squad | Yes (Bearer) |

---

## Visual Design & Aerodynamics Guidelines

All components strictly follow the aerodynamic Horizon Azure (`#0ea5e9`), Midnight Slate (`#0f172a`), and Sunset Amber (`#f97316`) aesthetic defined in the Stitch design system. No visual elements were altered—only functional wiring, routing, reactive state, and live backend integration were layered around it.
#   L O R A  
 