package com.yourorg.appname.repository;

import com.yourorg.appname.entity.ExpeditionBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpeditionBookingRepository extends JpaRepository<ExpeditionBooking, Long> {
    List<ExpeditionBooking> findByExpeditionId(Long expeditionId);
    List<ExpeditionBooking> findByUserId(Long userId);
}
