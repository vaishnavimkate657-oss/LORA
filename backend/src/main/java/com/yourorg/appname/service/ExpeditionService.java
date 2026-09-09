package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.ExpeditionBookingRequest;
import com.yourorg.appname.dto.response.ExpeditionBookingResponse;
import com.yourorg.appname.dto.response.GroupExpeditionResponse;

import java.util.List;

public interface ExpeditionService {
    List<GroupExpeditionResponse> getAllExpeditions();
    GroupExpeditionResponse getExpeditionById(Long id);
    ExpeditionBookingResponse joinExpedition(String userEmail, ExpeditionBookingRequest request);
    List<ExpeditionBookingResponse> getBookingsForExpedition(Long expeditionId);
}
