package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByIsTrendingTrue();
    List<Destination> findByCategoryIgnoreCase(String category);

    @Query("SELECT d FROM Destination d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.locationState) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.country) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Destination> searchDestinations(@Param("search") String search);
}
