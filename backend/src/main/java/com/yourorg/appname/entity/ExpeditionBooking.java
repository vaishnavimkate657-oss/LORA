package com.yourorg.appname.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expedition_bookings")
public class ExpeditionBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expedition_id", nullable = false)
    private GroupExpedition expedition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "spots_booked", nullable = false)
    private Integer spotsBooked = 1;

    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    public ExpeditionBooking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GroupExpedition getExpedition() { return expedition; }
    public void setExpedition(GroupExpedition expedition) { this.expedition = expedition; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getSpotsBooked() { return spotsBooked; }
    public void setSpotsBooked(Integer spotsBooked) { this.spotsBooked = spotsBooked; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
}
