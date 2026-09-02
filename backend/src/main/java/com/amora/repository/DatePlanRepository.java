package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.DatePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatePlanRepository extends JpaRepository<DatePlan, Long> {
    List<DatePlan> findByCoupleOrderByCreatedAtDesc(Couple couple);
}
