package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.ExpeditionBookingRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.ExpeditionBookingResponse;
import com.yourorg.appname.dto.response.GroupExpeditionResponse;
import com.yourorg.appname.service.ExpeditionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expeditions")
public class ExpeditionController {

    private final ExpeditionService expeditionService;

    public ExpeditionController(ExpeditionService expeditionService) {
        this.expeditionService = expeditionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupExpeditionResponse>>> getAllExpeditions() {
        List<GroupExpeditionResponse> expeditions = expeditionService.getAllExpeditions();
        return ResponseEntity.ok(ApiResponse.success(expeditions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupExpeditionResponse>> getExpeditionById(@PathVariable Long id) {
        GroupExpeditionResponse expedition = expeditionService.getExpeditionById(id);
        return ResponseEntity.ok(ApiResponse.success(expedition));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<ExpeditionBookingResponse>> joinExpedition(
            Authentication authentication,
            @Valid @RequestBody ExpeditionBookingRequest request
    ) {
        String email = authentication.getName();
        ExpeditionBookingResponse booking = expeditionService.joinExpedition(email, request);
        return new ResponseEntity<>(ApiResponse.success("Successfully joined the expedition!", booking), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<ApiResponse<List<ExpeditionBookingResponse>>> getBookingsForExpedition(@PathVariable Long id) {
        List<ExpeditionBookingResponse> bookings = expeditionService.getBookingsForExpedition(id);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}
