package com.yourorg.appname.dto.response;

import java.time.LocalDateTime;

public class ExpeditionBookingResponse {
    private Long id;
    private Long expeditionId;
    private String expeditionTitle;
    private Long userId;
    private String userName;
    private Integer spotsBooked;
    private LocalDateTime bookingDate;

    public ExpeditionBookingResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getExpeditionId() { return expeditionId; }
    public void setExpeditionId(Long expeditionId) { this.expeditionId = expeditionId; }

    public String getExpeditionTitle() { return expeditionTitle; }
    public void setExpeditionTitle(String expeditionTitle) { this.expeditionTitle = expeditionTitle; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Integer getSpotsBooked() { return spotsBooked; }
    public void setSpotsBooked(Integer spotsBooked) { this.spotsBooked = spotsBooked; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
}
