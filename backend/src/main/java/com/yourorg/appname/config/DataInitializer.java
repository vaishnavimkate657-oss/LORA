package com.yourorg.appname.config;

import com.yourorg.appname.entity.*;
import com.yourorg.appname.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

/**
 * Automatically seeds initial demo data on fresh databases (e.g. Render PostgreSQL or local clean instance)
 * when no user records exist.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final PartnerPostRepository partnerPostRepository;
    private final GroupExpeditionRepository groupExpeditionRepository;
    private final TripRepository tripRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            DestinationRepository destinationRepository,
            PartnerPostRepository partnerPostRepository,
            GroupExpeditionRepository groupExpeditionRepository,
            TripRepository tripRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.partnerPostRepository = partnerPostRepository;
        this.groupExpeditionRepository = groupExpeditionRepository;
        this.tripRepository = tripRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data ({} users found). Skipping seed initialization.", userRepository.count());
            return;
        }

        log.info("Fresh database detected. Seeding initial TripPartner demo data...");

        String encodedPassword = passwordEncoder.encode("password123");

        // 1. Seed Demo Users
        User alex = new User(
                "demo@trippartner.com",
                encodedPassword,
                "Alex Mercer",
                26,
                "San Francisco",
                "USA",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCOnj1GQYR9gtTXRzmQL8_wCs0_AelRfvSfZJqu8sPWwaVINdPD0tCtVdmwP1SHswocQDb6l7AH5h-ekkTdSBU1wfEriCisgWD05DzCObGT7V6ZH9aH1bb_SbFMjALgdg7jM5j2V45_Z8bDCZodbdJ24bTAKsMLSp-0bTT01s5osdwABfUGW4_TnJq_eft8DaxfeDwg4FbeWi5Ol-vWr7QO-ZzpZWlXzj52_rAG0nP3q-PpFt967DhM",
                "Avid backpacker and community trekker eager to explore the Himalayas and coastal gems."
        );
        alex.setIsVerified(true);
        alex.setRole("ROLE_USER");

        User ananya = new User(
                "ananya@trippartner.com",
                encodedPassword,
                "Ananya Sharma",
                24,
                "New Delhi",
                "India",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBNuVhevO6MewCXtxyZedzG-KNOJGJr9fptuRBJJ0pAoLh9-jQ1X7fdXzBpQ4pbCOsvXnSEvM2cqDBSm_bPwpanjVp_K4QOioUQv1QFFms_MamiR1NIT3q2wekI7Ph3Xvt7kpTvjnQ52Pv6bOMwUoBrCsuvh1-Ogfykc4ee6w4T8xhyAvebsLY4I-lBhl4LfyBATBmi7sakEGc8qYd0qr8Y12DXkiHwhyaxYWBKfaoEiLvfTAIO0KS4",
                "Passionate hiker and solo wanderer fond of mountain trails and local cultural jams."
        );
        ananya.setIsVerified(true);
        ananya.setRole("ROLE_USER");

        User marcus = new User(
                "marcus@trippartner.com",
                encodedPassword,
                "Marcus Vance",
                28,
                "London",
                "UK",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuClSPsNG2L14y-cB4xjcLe45p6hKofUaHIBL5JaO2aoHJDa2HK-J_g_GdXmVEdXT0NwvxC3Vb7_aTxLEyZ5GWeYFN4TpNnFV_tMeGN8e3fAQe4_rGX7NskLkv7IHobObpzqxkiUOwFlv0LzMY76mR9w0kQfbBJLE1pwY6SpnbDYXywq9gMhhvYX--3DUhDnoeQw2JOIP2A0Gw98K2f35eKEjcFGlav2JGuiD2Ud3cYRwhFXkHYqTLRi",
                "Remote developer working from beach cafes across Southeast Asia and coastal India."
        );
        marcus.setIsVerified(true);
        marcus.setRole("ROLE_USER");

        User priya = new User(
                "priya@trippartner.com",
                encodedPassword,
                "Priya & Rohan",
                27,
                "Bangalore",
                "India",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD5RlC9T7RJpQQ2zinvux-6j3Fyv_mb_ez2Clyi34x3TnxFhWjx8XE-jMOc6jR0vqieVocAVFNjFrfUj6rcoaq9IDlpZZT1ygD8YH01gQHRW_MZsfvBH2dLga2qULJFCIo_mTQUBXmm38FFnpiEgkznNigXLZ-8hZoSu16f337S47B8e7cWtPK_986fK6utJtlAAGvvmlCCLkhVXAF0EHIWmDuUoaDef4kVYHhU8rM-jXLpmHrPpVKI",
                "Couple travel bloggers addicted to motorbiking high passes and capturing breathtaking sunsets."
        );
        priya.setIsVerified(true);
        priya.setRole("ROLE_USER");

        User elena = new User(
                "elena@trippartner.com",
                encodedPassword,
                "Elena Rostova",
                25,
                "Berlin",
                "Germany",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCbfAXEQ7KsYoLSBPV3gouSBufuexsdIqBQcPctxTk-nrJ6K1uGo1qCr2DhYZGTCRrW4s-klADbJQ1HatzE_LhvYp2rj8dMjsPyyR1IaJeanYrIzFpai4YvscplSmbH0HB9L6vS1RcqgwreO69pwsj_8PUnRCF5zR4UOCu69lcMTShdj3DsLTigkjE0eao1mGaLS0HQYI3QpnWOZ3fHvxXklbnFslhvDEPHfvA4wYZ3m-DFNC6z9m",
                "Yoga instructor exploring holistic retreats, organic tea estates, and mindful wandering."
        );
        elena.setIsVerified(true);
        elena.setRole("ROLE_USER");

        userRepository.saveAll(Arrays.asList(alex, ananya, marcus, priya, elena));
        log.info("Seeded 5 demo users.");

        // 2. Seed Destinations
        Destination goa = createDestination("Goa", "India", "India", "Beach & Nightlife",
                "Sun-drenched beaches, vibrant night markets, coastal shacks, and legendary sunset music circles.",
                new BigDecimal("240.00"), new BigDecimal("4.8"), 2400,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC8OKOBfKvbU0yg8qfrh45wyL5Z8lalJa-Dg47KkGOHxmLPdxMjwcx18VFsPJnKn5MYG07jclrymqGjM7aFFZw-sZf7T1NHrpciYSI5TCYi6mwSYvRONWqsbEmp2nfVGL4YzIf7m0nbX7QurFgDPcMYay-g5GOhVQ325XBvR92yxbcoKlYZMgE10u77kjGosyoS-EoCMOvXh0rzw-wW6C-INksOJgNe2LNjV248SstOc7-cc63YvTj0", true);

        Destination manali = createDestination("Manali", "Himachal Pradesh", "India", "Adventure & Snow",
                "Snow-dusted pine trails, Solang valley paragliding thrills, and cozy riverside artist cafes.",
                new BigDecimal("310.00"), new BigDecimal("4.9"), 3100,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCqPRoCcyUZIKLRqzZ2UP7l046YRytJrPxysOKr_x91PQPBV_wDACX_3093jNy1sMDFraLU1ncfwnIeR-p67uIYRArLmjRC0ELLK38em37VNgA_EIz2uCer0iwmCkoWJ55PFBNyhKHxPbb51jeUW94NUq6xQusSUTugi-lk4rrLV2frp-6-FfqG6Gcf2QTWrGW4IUYNxPoP8nKfGB1Fbh1hIS1BvncmPdy9tZTb9yKs5x_E57dijCCu", true);

        Destination srinagar = createDestination("Srinagar & Gulmarg", "Kashmir", "India", "Scenic Valley",
                "The paradise on earth — Shikara rides on mirror Dal Lake, saffron hills, and Gulmarg gondolas.",
                new BigDecimal("420.00"), new BigDecimal("4.9"), 4200,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDl0H2nkBCpriuCqVMDaKtq2iflA4kEwzYKd4UpVLrlQJyoLl0Ka0WD27OXfVN8fq6dOB7zeFFOUNolL1rUD46AaMpzBbMpZAGNARL1Qzx-HvfcKXl-nlvt2vYUqLiVx3lyhkEaM7VnWtnB_D4lNynUaI1am_wcvqYVsVh0suA1TN7U_O8Vlc2dJ18yC5K83u9H0OejCKZ8P7ZlPuJm4Qwfmy7l1bdUw-psGpDepkfrb9KuGQGnAulF", true);

        Destination jaipur = createDestination("Jaipur", "Rajasthan", "India", "Culture & Royalty",
                "Royal palaces, imposing Amer Fort ramparts, authentic spice bazaars, and opulent heritage stays.",
                new BigDecimal("190.00"), new BigDecimal("4.7"), 1900,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCkrT9uARsPUUE5PuCzXls0kbW_wTKAPy15qmkaB8MBRDK5CzfAM4_u8r9HJoH-b9qfLrwn3j_pZ-zNtMcj_-NPgIblvag882mOGDK5RXoE02AOBVlcQXDQsmm1N38gKYgtWW6fROJ2TK_x064SK6k9WsL_BwLDX-8t_TDx3BN-Pqc3-bAy3aBO4Bg5Z9X76wbBCyFoQ96aoW3WF-fEUhqfbU0Zfk4YsGiTH1PQM6Y7CUrOESzZyeU0", true);

        Destination kerala = createDestination("Kerala", "South India", "India", "Serene Nature",
                "Tranquil backwaters, Alleppey overnight houseboats, and rolling tea hill plantations in Munnar.",
                new BigDecimal("280.00"), new BigDecimal("4.9"), 2800,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDnRhi2p3s-b2Rx4_vm68fXfTEefhsTnFoDi_DusIJAN3kBGSEgBaZhKATT86h_KAD1Ddlux7ebgdLj-jKB5fwK2kykRaC2ufq0kD1E4Beg_aPMtMzcSBCsYI4HwmVhqenx1i6nrW5lRZiRAuZSXqyN-8WUmSHqoK30MOSXfHbf6t8TKvTJ1E68ftRMRG_BDeCf_WTeURh8XkplTDCwMCZw1z51_ETNqxtNRLtOwZGF7uJINmvThSDd", true);

        Destination ladakh = createDestination("Ladakh", "High Altitude", "India", "Epic Roadtrip",
                "High-altitude desert passes, Pangong Tso deep blue lakes, and cliffside ancient Tibetan monasteries.",
                new BigDecimal("520.00"), new BigDecimal("5.0"), 1600,
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBs9dPAjeFxrrpAlOOHXBrMfT2R-TATUn0rjnFZy56XJh3I_rdH19Tv9MKuLHmFtChqtWaoeYyWBbzyrfzmu_T6DF4Ui-zRj08kicxwBfGNT1FtTmQWcCkw1cqHwmFAIQYG7bQgTO9XUTvcwZIYcbgoGpZpNGSGuOAt4s_ahqSTT4XXxRnSRV53XsoAXxldFpGosD2h9WgSuKrf4Ev08bUKHvbqRt0BBXejk3uxWQRXih7Wt9zwOrEl", true);

        destinationRepository.saveAll(Arrays.asList(goa, manali, srinagar, jaipur, kerala, ladakh));
        log.info("Seeded 6 featured destinations.");

        // 3. Seed Partner Posts
        PartnerPost post1 = new PartnerPost();
        post1.setUser(ananya);
        post1.setDestination("Manali & Spiti Valley");
        post1.setTravelStyle("Backpacker • Trekking");
        post1.setMinBudget(new BigDecimal("350.00"));
        post1.setMaxBudget(new BigDecimal("500.00"));
        post1.setDateRange("Nov 12 - Nov 20");
        post1.setNote("Looking for 1-2 chill travel buddies to split cab costs from Chandigarh and do the Hampta Pass trek together!");
        post1.setPreferredGender("Any");
        post1.setStatus("OPEN");

        PartnerPost post2 = new PartnerPost();
        post2.setUser(marcus);
        post2.setDestination("Goa & South Coast");
        post2.setTravelStyle("Surfing • Cafes • Work");
        post2.setMinBudget(new BigDecimal("700.00"));
        post2.setMaxBudget(new BigDecimal("900.00"));
        post2.setDateRange("Dec 05 - Dec 18");
        post2.setNote("Digital nomad spending 2 weeks in South Goa. Love live acoustic sets, co-working beach cafes, and scooter rides.");
        post2.setPreferredGender("Any");
        post2.setStatus("OPEN");

        PartnerPost post3 = new PartnerPost();
        post3.setUser(priya);
        post3.setDestination("Ladakh Bike Expedition");
        post3.setTravelStyle("Road Trip • High Altitude");
        post3.setMinBudget(new BigDecimal("550.00"));
        post3.setMaxBudget(new BigDecimal("650.00"));
        post3.setDateRange("Oct 22 - Oct 30");
        post3.setNote("Renting Himalayan bikes from Leh. Need 2 more riders to form a solid convoy with a shared back-up gear van.");
        post3.setPreferredGender("Any");
        post3.setStatus("OPEN");

        PartnerPost post4 = new PartnerPost();
        post4.setUser(elena);
        post4.setDestination("Kerala & Munnar Hills");
        post4.setTravelStyle("Yoga • Slow Travel");
        post4.setMinBudget(new BigDecimal("400.00"));
        post4.setMaxBudget(new BigDecimal("500.00"));
        post4.setDateRange("Nov 02 - Nov 10");
        post4.setNote("First time in India! Looking for a female buddy for Ayurvedic retreats, Munnar tea hikes, and peaceful stays.");
        post4.setPreferredGender("Female");
        post4.setStatus("OPEN");

        partnerPostRepository.saveAll(Arrays.asList(post1, post2, post3, post4));
        log.info("Seeded 4 partner match posts.");

        // 4. Seed Group Expeditions
        GroupExpedition exp1 = new GroupExpedition();
        exp1.setTitle("Spiti Valley Winter Expedition");
        exp1.setDestination("Spiti Valley, Himachal");
        exp1.setDuration("7 Days");
        exp1.setDateRange("Nov 15 - 22");
        exp1.setPricePerPerson(new BigDecimal("480.00"));
        exp1.setTotalSlots(6);
        exp1.setFilledSlots(4);
        exp1.setDescription("Explore ancient Ki Monastery, frozen river walks, stargazing in Kaza, and local homestay culinary experiences.");
        exp1.setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuBcqlKqf4sQGYery4UW09puCn4Ep8OUVi13JjTQ-5nQXJ05cn5eeATBuRxhZonEAspCxHB7F398QbpaSQdvSO_UvmbKzlRXOdQtfGQVLL9m5zHzrNrAgk0zbfT3GKX5_iMa95YAReg2Yc5yFoCo0VfZqv88DMWlX3ElCj2vBZqlzlgrOrgR0duqyqKPgewYD5ABIXUV_2_QAfHwSbhwNCU0-KZblGbyHh1NCzTHUJFMYSWtH6ldFzN8");

        GroupExpedition exp2 = new GroupExpedition();
        exp2.setTitle("Gokarna Beach Camping & Trek");
        exp2.setDestination("Gokarna, Karnataka");
        exp2.setDuration("3 Days");
        exp2.setDateRange("Every Weekend");
        exp2.setPricePerPerson(new BigDecimal("160.00"));
        exp2.setTotalSlots(10);
        exp2.setFilledSlots(8);
        exp2.setDescription("Five-beach trek covering Paradise and Half Moon beaches, cliff jumping, bonfire acoustic nights, and bioluminescence watch.");
        exp2.setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuCpIbM1flkL56wU3aiSGA1pRguey8OPoIXYFbZbrexqQH9Ff6b0Y5LmjAI7y7hNDcQiPt7Q5vTEBZQuRzrYYA36Vv9CP6wwORJ8Xc7v7xeVttmSFvhNXWCDrz8R7WwcSLdBipNdwH7r5SaFqdd_uqOVrnMSi9TjKAY8VqQmy5uUFcfw5hxruDo7IWUvbwjbw_iPvBEWZ0gkidE715Y6xGTxqaEMoKMpBEzt7fCc4Zw98vpQLPWX4O1e");

        GroupExpedition exp3 = new GroupExpedition();
        exp3.setTitle("Meghalaya Root Bridges & Falls");
        exp3.setDestination("Cherrapunji & Dawki");
        exp3.setDuration("6 Days");
        exp3.setDateRange("Dec 01 - 06");
        exp3.setPricePerPerson(new BigDecimal("410.00"));
        exp3.setTotalSlots(5);
        exp3.setFilledSlots(3);
        exp3.setDescription("Hike to Nongriat double decker root bridges, cliff jump into transparent Umngot River at Dawki, and explore sacred caves.");
        exp3.setImageUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuCdC8wZk8NzRdj_iBaSt2K1K_6cARz0UlnbAKYcqR1skidBda3MXkeuqFhwTpUfd1XTf6TWMCpOFwrPFf7xXNVVhtKAxuyVTXtu4KidS9fAAjcYhePAtZlH3_frDCfamtHQ_zCvpzRfAvLP_dZxXE32D8-yXkoeMqkvp1KPaFBHVrFUIiKU1iT6ZrgY2mjkAOu6XZ-2Ihw7nCZDSJRA3hCLlJKDFW2X7Iz1AZK-NoUMXKCS84WRCVsM");

        groupExpeditionRepository.saveAll(Arrays.asList(exp1, exp2, exp3));
        log.info("Seeded 3 open group expeditions.");

        // 5. Seed Sample Trip for Alex Mercer
        Trip trip = new Trip();
        trip.setUser(alex);
        trip.setTitle("Manali Expedition");
        trip.setDestination("Manali, Himachal Pradesh");
        trip.setDurationDays(5);
        trip.setEstimatedCost(new BigDecimal("420.00"));
        trip.setStatus("ACTIVE");

        ItineraryItem item1 = new ItineraryItem();
        item1.setTrip(trip);
        item1.setDayNumber(1);
        item1.setTitle("Day 1: Arrival & Old Manali Cafes");
        item1.setDescription("Check-in at wooden hostel, Hadimba forest walk, and live folk jam session at Dylan's Cafe.");
        item1.setStatus("COMPLETED");
        item1.setOrderIndex(1);

        ItineraryItem item2 = new ItineraryItem();
        item2.setTrip(trip);
        item2.setDayNumber(2);
        item2.setTitle("Day 2: Solang Valley Thrills");
        item2.setDescription("Morning tandem paragliding from 8,000ft, zorbing races, and hot roadside thukpa lunch.");
        item2.setStatus("IN_PROGRESS");
        item2.setOrderIndex(2);

        ItineraryItem item3 = new ItineraryItem();
        item3.setTrip(trip);
        item3.setDayNumber(3);
        item3.setTitle("Day 3: Rohtang Pass Glacial Drive");
        item3.setDescription("Scenic 4x4 high altitude pass crossing, snow photography at 13,058 ft, and return bonfire.");
        item3.setStatus("UPCOMING");
        item3.setOrderIndex(3);

        trip.getItineraryItems().addAll(Arrays.asList(item1, item2, item3));

        TripExpense expLodging = new TripExpense();
        expLodging.setTrip(trip);
        expLodging.setCategory("LODGING");
        expLodging.setDescription("Lodging (Hostel & Camps)");
        expLodging.setAmount(new BigDecimal("168.00"));
        expLodging.setPercentage(new BigDecimal("40.00"));

        TripExpense expTransfer = new TripExpense();
        expTransfer.setTrip(trip);
        expTransfer.setCategory("TRANSFER");
        expTransfer.setDescription("Local SUV Transfer");
        expTransfer.setAmount(new BigDecimal("105.00"));
        expTransfer.setPercentage(new BigDecimal("25.00"));

        TripExpense expFood = new TripExpense();
        expFood.setTrip(trip);
        expFood.setCategory("FOOD");
        expFood.setDescription("Food & Local Treats");
        expFood.setAmount(new BigDecimal("84.00"));
        expFood.setPercentage(new BigDecimal("20.00"));

        TripExpense expActivities = new TripExpense();
        expActivities.setTrip(trip);
        expActivities.setCategory("ACTIVITIES");
        expActivities.setDescription("Permits & Paragliding");
        expActivities.setAmount(new BigDecimal("63.00"));
        expActivities.setPercentage(new BigDecimal("15.00"));

        trip.getTripExpenses().addAll(Arrays.asList(expLodging, expTransfer, expFood, expActivities));

        tripRepository.save(trip);
        log.info("Seeded sample trip with itinerary items and budget expenses.");
        log.info("Database seeding complete! Application is 100% ready.");
    }

    private Destination createDestination(String title, String state, String country, String category,
                                          String desc, BigDecimal price, BigDecimal rating, Integer reviews,
                                          String imageUrl, Boolean isTrending) {
        Destination d = new Destination();
        d.setTitle(title);
        d.setLocationState(state);
        d.setCountry(country);
        d.setCategory(category);
        d.setDescription(desc);
        d.setStartingPrice(price);
        d.setRating(rating);
        d.setReviewsCount(reviews);
        d.setImageUrl(imageUrl);
        d.setIsTrending(isTrending);
        return d;
    }
}
