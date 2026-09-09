package com.yourorg.appname.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PartnerPostResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Integer userAge;
    private String userCity;
    private String userCountry;
    private String userAvatar;
    private String userBio;
    private Boolean isUserVerified;
    private String destination;
    private String travelStyle;
    private BigDecimal minBudget;
    private BigDecimal maxBudget;
    private String dateRange;
    private String note;
    private String preferredGender;
    private String status;
    private LocalDateTime createdAt;

    public PartnerPostResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Integer getUserAge() { return userAge; }
    public void setUserAge(Integer userAge) { this.userAge = userAge; }

    public String getUserCity() { return userCity; }
    public void setUserCity(String userCity) { this.userCity = userCity; }

    public String getUserCountry() { return userCountry; }
    public void setUserCountry(String userCountry) { this.userCountry = userCountry; }

    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }

    public String getUserBio() { return userBio; }
    public void setUserBio(String userBio) { this.userBio = userBio; }

    public Boolean getIsUserVerified() { return isUserVerified; }
    public void setIsUserVerified(Boolean isUserVerified) { this.isUserVerified = isUserVerified; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getTravelStyle() { return travelStyle; }
    public void setTravelStyle(String travelStyle) { this.travelStyle = travelStyle; }

    public BigDecimal getMinBudget() { return minBudget; }
    public void setMinBudget(BigDecimal minBudget) { this.minBudget = minBudget; }

    public BigDecimal getMaxBudget() { return maxBudget; }
    public void setMaxBudget(BigDecimal maxBudget) { this.maxBudget = maxBudget; }

    public String getDateRange() { return dateRange; }
    public void setDateRange(String dateRange) { this.dateRange = dateRange; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getPreferredGender() { return preferredGender; }
    public void setPreferredGender(String preferredGender) { this.preferredGender = preferredGender; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
