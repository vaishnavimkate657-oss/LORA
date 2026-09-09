package com.yourorg.appname.repository;

import com.yourorg.appname.entity.GroupExpedition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupExpeditionRepository extends JpaRepository<GroupExpedition, Long> {
}
