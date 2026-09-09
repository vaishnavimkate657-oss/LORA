package com.yourorg.appname.repository;

import com.yourorg.appname.entity.PartnerConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartnerConnectionRequestRepository extends JpaRepository<PartnerConnectionRequest, Long> {
    List<PartnerConnectionRequest> findByPartnerPostId(Long partnerPostId);
    List<PartnerConnectionRequest> findBySenderId(Long senderId);
}
