package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.ExpeditionBookingRequest;
import com.yourorg.appname.dto.response.ExpeditionBookingResponse;
import com.yourorg.appname.dto.response.GroupExpeditionResponse;
import com.yourorg.appname.entity.ExpeditionBooking;
import com.yourorg.appname.entity.GroupExpedition;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.ExpeditionBookingRepository;
import com.yourorg.appname.repository.GroupExpeditionRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.ExpeditionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpeditionServiceImpl implements ExpeditionService {

    private final GroupExpeditionRepository expeditionRepository;
    private final ExpeditionBookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    public ExpeditionServiceImpl(
            GroupExpeditionRepository expeditionRepository,
            ExpeditionBookingRepository bookingRepository,
            UserRepository userRepository,
            EntityDtoMapper mapper
    ) {
        this.expeditionRepository = expeditionRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupExpeditionResponse> getAllExpeditions() {
        return expeditionRepository.findAll().stream()
                .map(mapper::toGroupExpeditionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupExpeditionResponse getExpeditionById(Long id) {
        GroupExpedition exp = expeditionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expedition not found with id: " + id));
        return mapper.toGroupExpeditionResponse(exp);
    }

    @Override
    @Transactional
    public ExpeditionBookingResponse joinExpedition(String userEmail, ExpeditionBookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        GroupExpedition exp = expeditionRepository.findById(request.getExpeditionId())
                .orElseThrow(() -> new ResourceNotFoundException("Expedition not found: " + request.getExpeditionId()));

        int remainingSlots = exp.getTotalSlots() - exp.getFilledSlots();
        if (request.getSpotsBooked() > remainingSlots) {
            throw new BadRequestException("Not enough spots available. Only " + remainingSlots + " spots left.");
        }

        exp.setFilledSlots(exp.getFilledSlots() + request.getSpotsBooked());
        expeditionRepository.save(exp);

        ExpeditionBooking booking = new ExpeditionBooking();
        booking.setUser(user);
        booking.setExpedition(exp);
        booking.setSpotsBooked(request.getSpotsBooked());

        ExpeditionBooking saved = bookingRepository.save(booking);
        return mapper.toBookingResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpeditionBookingResponse> getBookingsForExpedition(Long expeditionId) {
        return bookingRepository.findByExpeditionId(expeditionId).stream()
                .map(mapper::toBookingResponse)
                .collect(Collectors.toList());
    }
}
