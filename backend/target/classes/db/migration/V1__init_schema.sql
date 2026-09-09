-- ==========================================================
-- TripPartner Database Migration V1: Initial Schema & Seed Data
-- Dialect: Microsoft SQL Server (MSSQL)
-- ==========================================================

-- 1. Users Table
IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(255) NOT NULL,
        age INT NULL,
        city NVARCHAR(100) NULL,
        country NVARCHAR(100) NULL,
        avatar_url NVARCHAR(1000) NULL,
        bio NVARCHAR(MAX) NULL,
        role NVARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
        is_verified BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;

-- 2. Destinations Table
IF OBJECT_ID('dbo.destinations', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.destinations (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        location_state NVARCHAR(100) NOT NULL,
        country NVARCHAR(100) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL,
        rating DECIMAL(3,1) NOT NULL DEFAULT 5.0,
        reviews_count INT NOT NULL DEFAULT 0,
        image_url NVARCHAR(1000) NOT NULL,
        is_trending BIT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;

-- 3. Trips Table
IF OBJECT_ID('dbo.trips', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.trips (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        destination NVARCHAR(255) NOT NULL,
        duration_days INT NOT NULL,
        estimated_cost DECIMAL(10,2) NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        start_date DATE NULL,
        end_date DATE NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
    );
END;

-- 4. Itinerary Items Table
IF OBJECT_ID('dbo.itinerary_items', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.itinerary_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trip_id BIGINT NOT NULL,
        day_number INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'UPCOMING',
        order_index INT NOT NULL DEFAULT 0,
        CONSTRAINT fk_itinerary_trip FOREIGN KEY (trip_id) REFERENCES dbo.trips(id) ON DELETE CASCADE
    );
END;

-- 5. Trip Expenses Table (Budget Splitter)
IF OBJECT_ID('dbo.trip_expenses', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.trip_expenses (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trip_id BIGINT NOT NULL,
        category NVARCHAR(100) NOT NULL,
        description NVARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) REFERENCES dbo.trips(id) ON DELETE CASCADE
    );
END;

-- 6. Partner Posts Table (Find Travel Buddies)
IF OBJECT_ID('dbo.partner_posts', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.partner_posts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        destination NVARCHAR(255) NOT NULL,
        travel_style NVARCHAR(150) NOT NULL,
        min_budget DECIMAL(10,2) NOT NULL,
        max_budget DECIMAL(10,2) NOT NULL,
        date_range NVARCHAR(100) NOT NULL,
        note NVARCHAR(MAX) NOT NULL,
        preferred_gender NVARCHAR(50) NOT NULL DEFAULT 'Any',
        status NVARCHAR(50) NOT NULL DEFAULT 'OPEN',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_partner_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
    );
END;

-- 7. Partner Connection Requests Table
IF OBJECT_ID('dbo.partner_connection_requests', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.partner_connection_requests (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        partner_post_id BIGINT NOT NULL,
        sender_id BIGINT NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_conn_post FOREIGN KEY (partner_post_id) REFERENCES dbo.partner_posts(id) ON DELETE CASCADE,
        CONSTRAINT fk_conn_sender FOREIGN KEY (sender_id) REFERENCES dbo.users(id)
    );
END;

-- 8. Group Expeditions Table (Co-hosted open group trips)
IF OBJECT_ID('dbo.group_expeditions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.group_expeditions (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        destination NVARCHAR(255) NOT NULL,
        duration NVARCHAR(100) NOT NULL,
        date_range NVARCHAR(100) NOT NULL,
        price_per_person DECIMAL(10,2) NOT NULL,
        total_slots INT NOT NULL,
        filled_slots INT NOT NULL DEFAULT 0,
        description NVARCHAR(MAX) NOT NULL,
        image_url NVARCHAR(1000) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;

-- 9. Expedition Bookings Table
IF OBJECT_ID('dbo.expedition_bookings', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.expedition_bookings (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        expedition_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        spots_booked INT NOT NULL DEFAULT 1,
        booking_date DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_booking_expedition FOREIGN KEY (expedition_id) REFERENCES dbo.group_expeditions(id) ON DELETE CASCADE,
        CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES dbo.users(id)
    );
END;

-- ==========================================================
-- SEED DATA (Matches Stitch Design Exactly)
-- Note: Passwords below are BCrypt hashes for 'password123'
-- '$2a$10$7RmsyFsq70pL3e4q8wzM0erxUoi8zGv1lWc4a51e6m3mE4qN64c8G'
-- ==========================================================

-- Seed Users
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = 'demo@trippartner.com')
BEGIN
    INSERT INTO dbo.users (email, password, full_name, age, city, country, avatar_url, bio, role, is_verified)
    VALUES 
    ('demo@trippartner.com', '$2a$10$7RmsyFsq70pL3e4q8wzM0erxUoi8zGv1lWc4a51e6m3mE4qN64c8G', 'Alex Mercer', 26, 'San Francisco', 'USA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnj1GQYR9gtTXRzmQL8_wCs0_AelRfvSfZJqu8sPWwaVINdPD0tCtVdmwP1SHswocQDb6l7AH5h-ekkTdSBU1wfEriCisgWD05DzCObGT7V6ZH9aH1bb_SbFMjALgdg7jM5j2V45_Z8bDCZodbdJ24bTAKsMLSp-0bTT01s5osdwABfUGW4_TnJq_eft8DaxfeDwg4FbeWi5Ol-vWr7QO-ZzpZWlXzj52_rAG0nP3q-PpFt967DhM', 'Avid backpacker and community trekker eager to explore the Himalayas and coastal gems.', 'ROLE_USER', 1),
    
    ('ananya@trippartner.com', '$2a$10$7RmsyFsq70pL3e4q8wzM0erxUoi8zGv1lWc4a51e6m3mE4qN64c8G', 'Ananya Sharma', 24, 'New Delhi', 'India', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNuVhevO6MewCXtxyZedzG-KNOJGJr9fptuRBJJ0pAoLh9-jQ1X7fdXzBpQ4pbCOsvXnSEvM2cqDBSm_bPwpanjVp_K4QOioUQv1QFFms_MamiR1NIT3q2wekI7Ph3Xvt7kpTvjnQ52Pv6bOMwUoBrCsuvh1-Ogfykc4ee6w4T8xhyAvebsLY4I-lBhl4LfyBATBmi7sakEGc8qYd0qr8Y12DXkiHwhyaxYWBKfaoEiLvfTAIO0KS4', 'Passionate hiker and solo wanderer fond of mountain trails and local cultural jams.', 'ROLE_USER', 1),
    
    ('marcus@trippartner.com', '$2a$10$7RmsyFsq70pL3e4q8wzM0erxUoi8zGv1lWc4a51e6m3mE4qN64c8G', 'Marcus Vance', 28, 'London', 'UK', 'https://lh3.googleusercontent.com/aida-public/AB6AXuClSPsNG2L14y-cB4xjcLe45p6hKofUaHIBL5JaO2aoHJDa2HK-J_g_GdXmVEdXT0NwvxC3Vb7_aTxLEyZ5GWeYFN4TpNnFV_tMeGN8e3fAQe4_rGX7NskLkv7IHobObpzqxkiUOwFlv0LzMY76mR9w0kQfbBJLE1pwY6SpnbDYXywq9gMhhvYX--3DUhDnoeQw2JOIP2A0Gw98K2f35eKEjcFGlav2JGuiD2Ud3cYRwhFXkHYqTLRi', 'Remote developer working from beach cafes across Southeast Asia and coastal India.', 'ROLE_USER', 1),
    
    ('priya@trippartner.com', '$2a$10$7RmsyFsq70pL3e4q8wzM0erxUoi8zGv1lWc4a51e6m3mE4qN64c8G', 'Priya & Rohan', 27, 'Bangalore', 'India', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5RlC9T7RJpQQ2zinvux-6j3Fyv_mb_ez2Clyi34x3TnxFhWjx8XE-jMOc6jR0vqieVocAVFNjFrfUj6rcoaq9IDlpZZT1ygD8YH01gQHRW_MZsfvBH2dLga2qULJFCIo_mTQUBXmm38FFnpiEgkznNigXLZ-8hZoSu16f337S47B8e7cWtPK_986fK6utJtlAAGvvmlCCLkhVXAF0EHIWmDuUoaDef4kVYHhU8rM-jXLpmHrPpVKI', 'Couple travel bloggers addicted to motorbiking high passes and capturing breathtaking sunsets.', 'ROLE_USER', 1),
    
    ('elena@trippartner.com', '$2a$10$7RmsyFsq70pL3e4q8wzM0erxUoi8zGv1lWc4a51e6m3mE4qN64c8G', 'Elena Rostova', 25, 'Berlin', 'Germany', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoCbfAXEQ7KsYoLSBPV3gouSBufuexsdIqBQcPctxTk-nrJ6K1uGo1qCr2DhYZGTCRrW4s-klADbJQ1HatzE_LhvYp2rj8dMjsPyyR1IaJeanYrIzFpai4YvscplSmbH0HB9L6vS1RcqgwreO69pwsj_8PUnRCF5zR4UOCu69lcMTShdj3DsLTigkjE0eao1mGaLS0HQYI3QpnWOZ3fHvxXklbnFslhvDEPHfvA4wYZ3m-DFNC6z9m', 'Yoga instructor exploring holistic retreats, organic tea estates, and mindful wandering.', 'ROLE_USER', 1);
END;

-- Seed Destinations
IF NOT EXISTS (SELECT 1 FROM dbo.destinations WHERE title = 'Goa')
BEGIN
    INSERT INTO dbo.destinations (title, location_state, country, category, description, starting_price, rating, reviews_count, image_url, is_trending)
    VALUES
    ('Goa', 'India', 'India', 'Beach & Nightlife', 'Sun-drenched beaches, vibrant night markets, coastal shacks, and legendary sunset music circles.', 240.00, 4.8, 2400, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8OKOBfKvbU0yg8qfrh45wyL5Z8lalJa-Dg47KkGOHxmLPdxMjwcx18VFsPJnKn5MYG07jclrymqGjM7aFFZw-sZf7T1NHrpciYSI5TCYi6mwSYvRONWqsbEmp2nfVGL4YzIf7m0nbX7QurFgDPcMYay-g5GOhVQ325XBvR92yxbcoKlYZMgE10u77kjGosyoS-EoCMOvXh0rzw-wW6C-INksOJgNe2LNjV248SstOc7-cc63YvTj0', 1),
    
    ('Manali', 'Himachal Pradesh', 'India', 'Adventure & Snow', 'Snow-dusted pine trails, Solang valley paragliding thrills, and cozy riverside artist cafes.', 310.00, 4.9, 3100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqPRoCcyUZIKLRqzZ2UP7l046YRytJrPxysOKr_x91PQPBV_wDACX_3093jNy1sMDFraLU1ncfwnIeR-p67uIYRArLmjRC0ELLK38em37VNgA_EIz2uCer0iwmCkoWJ55PFBNyhKHxPbb51jeUW94NUq6xQusSUTugi-lk4rrLV2frp-6-FfqG6Gcf2QTWrGW4IUYNxPoP8nKfGB1Fbh1hIS1BvncmPdy9tZTb9yKs5x_E57dijCCu', 1),
    
    ('Srinagar & Gulmarg', 'Kashmir', 'India', 'Scenic Valley', 'The paradise on earth — Shikara rides on mirror Dal Lake, saffron hills, and Gulmarg gondolas.', 420.00, 4.9, 4200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl0H2nkBCpriuCqVMDaKtq2iflA4kEwzYKd4UpVLrlQJyoLl0Ka0WD27OXfVN8fq6dOB7zeFFOUNolL1rUD46AaMpzBbMpZAGNARL1Qzx-HvfcKXl-nlvt2vYUqLiVx3lyhkEaM7VnWtnB_D4lNynUaI1am_wcvqYVsVh0suA1TN7U_O8Vlc2dJ18yC5K83u9H0OejCKZ8P7ZlPuJm4Qwfmy7l1bdUw-psGpDepkfrb9KuGQGnAulF', 1),
    
    ('Jaipur', 'Rajasthan', 'India', 'Culture & Royalty', 'Royal palaces, imposing Amer Fort ramparts, authentic spice bazaars, and opulent heritage stays.', 190.00, 4.7, 1900, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkrT9uARsPUUE5PuCzXls0kbW_wTKAPy15qmkaB8MBRDK5CzfAM4_u8r9HJoH-b9qfLrwn3j_pZ-zNtMcj_-NPgIblvag882mOGDK5RXoE02AOBVlcQXDQsmm1N38gKYgtWW6fROJ2TK_x064SK6k9WsL_BwLDX-8t_TDx3BN-Pqc3-bAy3aBO4Bg5Z9X76wbBCyFoQ96aoW3WF-fEUhqfbU0Zfk4YsGiTH1PQM6Y7CUrOESzZyeU0', 1),
    
    ('Kerala', 'South India', 'India', 'Serene Nature', 'Tranquil backwaters, Alleppey overnight houseboats, and rolling tea hill plantations in Munnar.', 280.00, 4.9, 2800, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnRhi2p3s-b2Rx4_vm68fXfTEefhsTnFoDi_DusIJAN3kBGSEgBaZhKATT86h_KAD1Ddlux7ebgdLj-jKB5fwK2kykRaC2ufq0kD1E4Beg_aPMtMzcSBCsYI4HwmVhqenx1i6nrW5lRZiRAuZSXqyN-8WUmSHqoK30MOSXfHbf6t8TKvTJ1E68ftRMRG_BDeCf_WTeURh8XkplTDCwMCZw1z51_ETNqxtNRLtOwZGF7uJINmvThSDd', 1),
    
    ('Ladakh', 'High Altitude', 'India', 'Epic Roadtrip', 'High-altitude desert passes, Pangong Tso deep blue lakes, and cliffside ancient Tibetan monasteries.', 520.00, 5.0, 1600, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs9dPAjeFxrrpAlOOHXBrMfT2R-TATUn0rjnFZy56XJh3I_rdH19Tv9MKuLHmFtChqtWaoeYyWBbzyrfzmu_T6DF4Ui-zRj08kicxwBfGNT1FtTmQWcCkw1cqHwmFAIQYG7bQgTO9XUTvcwZIYcbgoGpZpNGSGuOAt4s_ahqSTT4XXxRnSRV53XsoAXxldFpGosD2h9WgSuKrf4Ev08bUKHvbqRt0BBXejk3uxWQRXih7Wt9zwOrEl', 1);
END;

-- Seed Partner Posts
IF NOT EXISTS (SELECT 1 FROM dbo.partner_posts WHERE destination LIKE '%Manali%')
BEGIN
    DECLARE @ananyaId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE email = 'ananya@trippartner.com');
    DECLARE @marcusId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE email = 'marcus@trippartner.com');
    DECLARE @priyaId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE email = 'priya@trippartner.com');
    DECLARE @elenaId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE email = 'elena@trippartner.com');

    INSERT INTO dbo.partner_posts (user_id, destination, travel_style, min_budget, max_budget, date_range, note, preferred_gender, status)
    VALUES
    (@ananyaId, 'Manali & Spiti Valley', 'Backpacker • Trekking', 350.00, 500.00, 'Nov 12 - Nov 20', 'Looking for 1-2 chill travel buddies to split cab costs from Chandigarh and do the Hampta Pass trek together!', 'Any', 'OPEN'),
    (@marcusId, 'Goa & South Coast', 'Surfing • Cafes • Work', 700.00, 900.00, 'Dec 05 - Dec 18', 'Digital nomad spending 2 weeks in South Goa. Love live acoustic sets, co-working beach cafes, and scooter rides.', 'Any', 'OPEN'),
    (@priyaId, 'Ladakh Bike Expedition', 'Road Trip • High Altitude', 550.00, 650.00, 'Oct 22 - Oct 30', 'Renting Himalayan bikes from Leh. Need 2 more riders to form a solid convoy with a shared back-up gear van.', 'Any', 'OPEN'),
    (@elenaId, 'Kerala & Munnar Hills', 'Yoga • Slow Travel', 400.00, 500.00, 'Nov 02 - Nov 10', 'First time in India! Looking for a female buddy for Ayurvedic retreats, Munnar tea hikes, and peaceful stays.', 'Female', 'OPEN');
END;

-- Seed Group Expeditions
IF NOT EXISTS (SELECT 1 FROM dbo.group_expeditions WHERE title LIKE '%Spiti%')
BEGIN
    INSERT INTO dbo.group_expeditions (title, destination, duration, date_range, price_per_person, total_slots, filled_slots, description, image_url)
    VALUES
    ('Spiti Valley Winter Expedition', 'Spiti Valley, Himachal', '7 Days', 'Nov 15 - 22', 480.00, 6, 4, 'Explore ancient Ki Monastery, frozen river walks, stargazing in Kaza, and local homestay culinary experiences.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcqlKqf4sQGYery4UW09puCn4Ep8OUVi13JjTQ-5nQXJ05cn5eeATBuRxhZonEAspCxHB7F398QbpaSQdvSO_UvmbKzlRXOdQtfGQVLL9m5zHzrNrAgk0zbfT3GKX5_iMa95YAReg2Yc5yFoCo0VfZqv88DMWlX3ElCj2vBZqlzlgrOrgR0duqyqKPgewYD5ABIXUV_2_QAfHwSbhwNCU0-KZblGbyHh1NCzTHUJFMYSWtH6ldFzN8'),
    
    ('Gokarna Beach Camping & Trek', 'Gokarna, Karnataka', '3 Days', 'Every Weekend', 160.00, 10, 8, 'Five-beach trek covering Paradise and Half Moon beaches, cliff jumping, bonfire acoustic nights, and bioluminescence watch.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpIbM1flkL56wU3aiSGA1pRguey8OPoIXYFbZbrexqQH9Ff6b0Y5LmjAI7y7hNDcQiPt7Q5vTEBZQuRzrYYA36Vv9CP6wwORJ8Xc7v7xeVttmSFvhNXWCDrz8R7WwcSLdBipNdwH7r5SaFqdd_uqOVrnMSi9TjKAY8VqQmy5uUFcfw5hxruDo7IWUvbwjbw_iPvBEWZ0gkidE715Y6xGTxqaEMoKMpBEzt7fCc4Zw98vpQLPWX4O1e'),
    
    ('Meghalaya Root Bridges & Falls', 'Cherrapunji & Dawki', '6 Days', 'Dec 01 - 06', 410.00, 5, 3, 'Hike to Nongriat double decker root bridges, cliff jump into transparent Umngot River at Dawki, and explore sacred caves.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdC8wZk8NzRdj_iBaSt2K1K_6cARz0UlnbAKYcqR1skidBda3MXkeuqFhwTpUfd1XTf6TWMCpOFwrPFf7xXNVVhtKAxuyVTXtu4KidS9fAAjcYhePAtZlH3_frDCfamtHQ_zCvpzRfAvLP_dZxXE32D8-yXkoeMqkvp1KPaFBHVrFUIiKU1iT6ZrgY2mjkAOu6XZ-2Ihw7nCZDSJRA3hCLlJKDFW2X7Iz1AZK-NoUMXKCS84WRCVsM');
END;

-- Seed Sample Trip with Itinerary & Expenses
IF NOT EXISTS (SELECT 1 FROM dbo.trips WHERE title = 'Manali Expedition')
BEGIN
    DECLARE @alexId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE email = 'demo@trippartner.com');

    INSERT INTO dbo.trips (user_id, title, destination, duration_days, estimated_cost, status)
    VALUES (@alexId, 'Manali Expedition', 'Manali, Himachal Pradesh', 5, 420.00, 'ACTIVE');

    DECLARE @tripId BIGINT = SCOPE_IDENTITY();

    INSERT INTO dbo.itinerary_items (trip_id, day_number, title, description, status, order_index)
    VALUES
    (@tripId, 1, 'Day 1: Arrival & Old Manali Cafes', 'Check-in at wooden hostel, Hadimba forest walk, and live folk jam session at Dylan''s Cafe.', 'COMPLETED', 1),
    (@tripId, 2, 'Day 2: Solang Valley Thrills', 'Morning tandem paragliding from 8,000ft, zorbing races, and hot roadside thukpa lunch.', 'IN_PROGRESS', 2),
    (@tripId, 3, 'Day 3: Rohtang Pass Glacial Drive', 'Scenic 4x4 high altitude pass crossing, snow photography at 13,058 ft, and return bonfire.', 'UPCOMING', 3);

    INSERT INTO dbo.trip_expenses (trip_id, category, description, amount, percentage)
    VALUES
    (@tripId, 'LODGING', 'Lodging (Hostel & Camps)', 168.00, 40.00),
    (@tripId, 'TRANSFER', 'Local SUV Transfer', 105.00, 25.00),
    (@tripId, 'FOOD', 'Food & Local Treats', 84.00, 20.00),
    (@tripId, 'ACTIVITIES', 'Permits & Paragliding', 63.00, 15.00);
END;
