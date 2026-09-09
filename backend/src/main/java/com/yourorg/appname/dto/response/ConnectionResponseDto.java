package com.yourorg.appname.dto.response;

import java.time.LocalDateTime;

public class ConnectionResponseDto {
    private Long id;
    private Long partnerPostId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public ConnectionResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPartnerPostId() { return partnerPostId; }
    public void setPartnerPostId(Long partnerPostId) { this.partnerPostId = partnerPostId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderAvatar() { return senderAvatar; }
    public void setSenderAvatar(String senderAvatar) { this.senderAvatar = senderAvatar; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
