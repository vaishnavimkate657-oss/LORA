package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ExpeditionBookingRequest {

    @NotNull(message = "Expedition ID is required")
    private Long expeditionId;

    @NotNull(message = "Spots booked is required")
    @Min(value = 1, message = "Must book at least 1 spot")
    private Integer spotsBooked = 1;

    public ExpeditionBookingRequest() {}

    public ExpeditionBookingRequest(Long expeditionId, Integer spotsBooked) {
        this.expeditionId = expeditionId;
        this.spotsBooked = spotsBooked;
    }

    public Long getExpeditionId() { return expeditionId; }
    public void setExpeditionId(Long expeditionId) { this.expeditionId = expeditionId; }

    public Integer getSpotsBooked() { return spotsBooked; }
    public void setSpotsBooked(Integer spotsBooked) { this.spotsBooked = spotsBooked; }
}
