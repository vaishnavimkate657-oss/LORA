package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());
        resp.setAge(user.getAge());
        resp.setCity(user.getCity());
        resp.setCountry(user.getCountry());
        resp.setAvatarUrl(user.getAvatarUrl());
        resp.setBio(user.getBio());
        resp.setRole(user.getRole());
        resp.setIsVerified(user.getIsVerified());
        return resp;
    }

    public DestinationResponse toDestinationResponse(Destination dest) {
        if (dest == null) return null;
        DestinationResponse resp = new DestinationResponse();
        resp.setId(dest.getId());
        resp.setTitle(dest.getTitle());
        resp.setLocationState(dest.getLocationState());
        resp.setCountry(dest.getCountry());
        resp.setCategory(dest.getCategory());
        resp.setDescription(dest.getDescription());
        resp.setStartingPrice(dest.getStartingPrice());
        resp.setRating(dest.getRating());
        resp.setReviewsCount(dest.getReviewsCount());
        resp.setImageUrl(dest.getImageUrl());
        resp.setIsTrending(dest.getIsTrending());
        return resp;
    }

    public TripResponse toTripResponse(Trip trip) {
        if (trip == null) return null;
        TripResponse resp = new TripResponse();
        resp.setId(trip.getId());
        if (trip.getUser() != null) {
            resp.setUserId(trip.getUser().getId());
            resp.setUserName(trip.getUser().getFullName());
            resp.setUserAvatar(trip.getUser().getAvatarUrl());
        }
        resp.setTitle(trip.getTitle());
        resp.setDestination(trip.getDestination());
        resp.setDurationDays(trip.getDurationDays());
        resp.setEstimatedCost(trip.getEstimatedCost());
        resp.setStatus(trip.getStatus());
        resp.setStartDate(trip.getStartDate());
        resp.setEndDate(trip.getEndDate());
        resp.setCreatedAt(trip.getCreatedAt());

        if (trip.getItineraryItems() != null) {
            resp.setItineraryItems(trip.getItineraryItems().stream()
                    .map(this::toItineraryItemResponse)
                    .collect(Collectors.toList()));
        }

        if (trip.getTripExpenses() != null) {
            resp.setTripExpenses(trip.getTripExpenses().stream()
                    .map(this::toTripExpenseResponse)
                    .collect(Collectors.toList()));
        }

        return resp;
    }

    public ItineraryItemResponse toItineraryItemResponse(ItineraryItem item) {
        if (item == null) return null;
        ItineraryItemResponse resp = new ItineraryItemResponse();
        resp.setId(item.getId());
        if (item.getTrip() != null) {
            resp.setTripId(item.getTrip().getId());
        }
        resp.setDayNumber(item.getDayNumber());
        resp.setTitle(item.getTitle());
        resp.setDescription(item.getDescription());
        resp.setStatus(item.getStatus());
        resp.setOrderIndex(item.getOrderIndex());
        return resp;
    }

    public TripExpenseResponse toTripExpenseResponse(TripExpense expense) {
        if (expense == null) return null;
        TripExpenseResponse resp = new TripExpenseResponse();
        resp.setId(expense.getId());
        if (expense.getTrip() != null) {
            resp.setTripId(expense.getTrip().getId());
        }
        resp.setCategory(expense.getCategory());
        resp.setDescription(expense.getDescription());
        resp.setAmount(expense.getAmount());
        resp.setPercentage(expense.getPercentage());
        return resp;
    }

    public PartnerPostResponse toPartnerPostResponse(PartnerPost post) {
        if (post == null) return null;
        PartnerPostResponse resp = new PartnerPostResponse();
        resp.setId(post.getId());
        if (post.getUser() != null) {
            resp.setUserId(post.getUser().getId());
            resp.setUserName(post.getUser().getFullName());
            resp.setUserAge(post.getUser().getAge());
            resp.setUserCity(post.getUser().getCity());
            resp.setUserCountry(post.getUser().getCountry());
            resp.setUserAvatar(post.getUser().getAvatarUrl());
            resp.setUserBio(post.getUser().getBio());
            resp.setIsUserVerified(post.getUser().getIsVerified());
        }
        resp.setDestination(post.getDestination());
        resp.setTravelStyle(post.getTravelStyle());
        resp.setMinBudget(post.getMinBudget());
        resp.setMaxBudget(post.getMaxBudget());
        resp.setDateRange(post.getDateRange());
        resp.setNote(post.getNote());
        resp.setPreferredGender(post.getPreferredGender());
        resp.setStatus(post.getStatus());
        resp.setCreatedAt(post.getCreatedAt());
        return resp;
    }

    public ConnectionResponseDto toConnectionResponse(PartnerConnectionRequest req) {
        if (req == null) return null;
        ConnectionResponseDto resp = new ConnectionResponseDto();
        resp.setId(req.getId());
        if (req.getPartnerPost() != null) {
            resp.setPartnerPostId(req.getPartnerPost().getId());
        }
        if (req.getSender() != null) {
            resp.setSenderId(req.getSender().getId());
            resp.setSenderName(req.getSender().getFullName());
            resp.setSenderAvatar(req.getSender().getAvatarUrl());
        }
        resp.setMessage(req.getMessage());
        resp.setStatus(req.getStatus());
        resp.setCreatedAt(req.getCreatedAt());
        return resp;
    }

    public GroupExpeditionResponse toGroupExpeditionResponse(GroupExpedition exp) {
        if (exp == null) return null;
        GroupExpeditionResponse resp = new GroupExpeditionResponse();
        resp.setId(exp.getId());
        resp.setTitle(exp.getTitle());
        resp.setDestination(exp.getDestination());
        resp.setDuration(exp.getDuration());
        resp.setDateRange(exp.getDateRange());
        resp.setPricePerPerson(exp.getPricePerPerson());
        resp.setTotalSlots(exp.getTotalSlots());
        resp.setFilledSlots(exp.getFilledSlots());
        resp.setDescription(exp.getDescription());
        resp.setImageUrl(exp.getImageUrl());
        resp.setCreatedAt(exp.getCreatedAt());
        return resp;
    }

    public ExpeditionBookingResponse toBookingResponse(ExpeditionBooking booking) {
        if (booking == null) return null;
        ExpeditionBookingResponse resp = new ExpeditionBookingResponse();
        resp.setId(booking.getId());
        if (booking.getExpedition() != null) {
            resp.setExpeditionId(booking.getExpedition().getId());
            resp.setExpeditionTitle(booking.getExpedition().getTitle());
        }
        if (booking.getUser() != null) {
            resp.setUserId(booking.getUser().getId());
            resp.setUserName(booking.getUser().getFullName());
        }
        resp.setSpotsBooked(booking.getSpotsBooked());
        resp.setBookingDate(booking.getBookingDate());
        return resp;
    }
}
