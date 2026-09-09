package com.yourorg.appname.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class GroupExpeditionResponse {
    private Long id;
    private String title;
    private String destination;
    private String duration;
    private String dateRange;
    private BigDecimal pricePerPerson;
    private Integer totalSlots;
    private Integer filledSlots;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    public GroupExpeditionResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getDateRange() { return dateRange; }
    public void setDateRange(String dateRange) { this.dateRange = dateRange; }

    public BigDecimal getPricePerPerson() { return pricePerPerson; }
    public void setPricePerPerson(BigDecimal pricePerPerson) { this.pricePerPerson = pricePerPerson; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getFilledSlots() { return filledSlots; }
    public void setFilledSlots(Integer filledSlots) { this.filledSlots = filledSlots; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
