package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PartnerPostRequest {

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Travel style is required")
    private String travelStyle;

    @NotNull(message = "Minimum budget is required")
    private BigDecimal minBudget;

    @NotNull(message = "Maximum budget is required")
    private BigDecimal maxBudget;

    @NotBlank(message = "Date range is required")
    private String dateRange;

    @NotBlank(message = "Note is required")
    private String note;

    private String preferredGender = "Any";

    public PartnerPostRequest() {}

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
}
