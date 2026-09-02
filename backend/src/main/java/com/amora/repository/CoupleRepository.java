package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoupleRepository extends JpaRepository<Couple, Long> {
    Optional<Couple> findByCoupleCode(String coupleCode);

    @Query("SELECT c FROM Couple c WHERE c.partner1 = :user OR c.partner2 = :user")
    Optional<Couple> findByPartner(@Param("user") User user);
}
