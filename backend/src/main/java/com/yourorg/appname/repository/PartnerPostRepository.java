package com.yourorg.appname.repository;

import com.yourorg.appname.entity.PartnerPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartnerPostRepository extends JpaRepository<PartnerPost, Long> {
    List<PartnerPost> findByStatusOrderByCreatedAtDesc(String status);
    List<PartnerPost> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT p FROM PartnerPost p WHERE " +
           "(:destination IS NULL OR LOWER(p.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:gender IS NULL OR :gender = 'Any' OR p.preferredGender = :gender OR p.preferredGender = 'Any') AND " +
           "(:style IS NULL OR LOWER(p.travelStyle) LIKE LOWER(CONCAT('%', :style, '%')))")
    List<PartnerPost> filterPartnerPosts(
            @Param("destination") String destination,
            @Param("gender") String gender,
            @Param("style") String style
    );
}
