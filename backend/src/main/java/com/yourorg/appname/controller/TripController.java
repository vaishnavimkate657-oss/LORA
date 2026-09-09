package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.ItineraryItemRequest;
import com.yourorg.appname.dto.request.TripExpenseRequest;
import com.yourorg.appname.dto.request.TripRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.ItineraryItemResponse;
import com.yourorg.appname.dto.response.TripExpenseResponse;
import com.yourorg.appname.dto.response.TripResponse;
import com.yourorg.appname.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripResponse>>> getAllTrips() {
        List<TripResponse> trips = tripService.getAllTrips();
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    @GetMapping("/my-trips")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getMyTrips(Authentication authentication) {
        String email = authentication.getName();
        List<TripResponse> trips = tripService.getTripsByUser(email);
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(@PathVariable Long id) {
        TripResponse trip = tripService.getTripById(id);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(
            Authentication authentication,
            @Valid @RequestBody TripRequest request
    ) {
        String email = (authentication != null) ? authentication.getName() : "demo@trippartner.com";
        TripResponse created = tripService.createTrip(email, request);
        return new ResponseEntity<>(ApiResponse.success("Trip created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody TripRequest request
    ) {
        TripResponse updated = tripService.updateTrip(id, request);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully", null));
    }

    @PostMapping("/{id}/itinerary")
    public ResponseEntity<ApiResponse<ItineraryItemResponse>> addItineraryItem(
            @PathVariable Long id,
            @Valid @RequestBody ItineraryItemRequest request
    ) {
        ItineraryItemResponse item = tripService.addItineraryItem(id, request);
        return new ResponseEntity<>(ApiResponse.success("Itinerary item added", item), HttpStatus.CREATED);
    }

    @DeleteMapping("/itinerary/{itemId}")
    public ResponseEntity<ApiResponse<String>> deleteItineraryItem(@PathVariable Long itemId) {
        tripService.deleteItineraryItem(itemId);
        return ResponseEntity.ok(ApiResponse.success("Itinerary item deleted", null));
    }

    @PostMapping("/{id}/expenses")
    public ResponseEntity<ApiResponse<TripExpenseResponse>> addTripExpense(
            @PathVariable Long id,
            @Valid @RequestBody TripExpenseRequest request
    ) {
        TripExpenseResponse expense = tripService.addTripExpense(id, request);
        return new ResponseEntity<>(ApiResponse.success("Trip expense added", expense), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/expenses")
    public ResponseEntity<ApiResponse<List<TripExpenseResponse>>> getTripExpenses(@PathVariable Long id) {
        List<TripExpenseResponse> expenses = tripService.getTripExpenses(id);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }
}
