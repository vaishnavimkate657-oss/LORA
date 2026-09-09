package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TripRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Duration in days is required")
    private Integer durationDays;

    @NotNull(message = "Estimated cost is required")
    private BigDecimal estimatedCost;

    private String status = "ACTIVE";
    private LocalDate startDate;
    private LocalDate endDate;

    private List<ItineraryItemRequest> itineraryItems;
    private List<TripExpenseRequest> tripExpenses;

    public TripRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public List<ItineraryItemRequest> getItineraryItems() { return itineraryItems; }
    public void setItineraryItems(List<ItineraryItemRequest> itineraryItems) { this.itineraryItems = itineraryItems; }

    public List<TripExpenseRequest> getTripExpenses() { return tripExpenses; }
    public void setTripExpenses(List<TripExpenseRequest> tripExpenses) { this.tripExpenses = tripExpenses; }
}
