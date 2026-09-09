package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ConnectionRequestDto {

    @NotNull(message = "Partner post ID is required")
    private Long partnerPostId;

    @NotBlank(message = "Message is required")
    private String message;

    public ConnectionRequestDto() {}

    public ConnectionRequestDto(Long partnerPostId, String message) {
        this.partnerPostId = partnerPostId;
        this.message = message;
    }

    public Long getPartnerPostId() { return partnerPostId; }
    public void setPartnerPostId(Long partnerPostId) { this.partnerPostId = partnerPostId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
