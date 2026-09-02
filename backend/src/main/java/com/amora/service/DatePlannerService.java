package com.amora.service;

import com.amora.dto.DatePlanRequest;
import com.amora.model.Couple;
import com.amora.model.DatePlan;
import com.amora.model.User;
import com.amora.repository.CoupleRepository;
import com.amora.repository.DatePlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DatePlannerService {

    private final DatePlanRepository datePlanRepository;
    private final CoupleRepository coupleRepository;

    public List<DatePlan> getPlans(User user) {
        if (user.getCoupleId() == null) return List.of();
        Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
        if (couple == null) return List.of();
        return datePlanRepository.findByCoupleOrderByCreatedAtDesc(couple);
    }

    @Transactional
    public DatePlan savePlan(User user, DatePlanRequest request) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("User must be in a couple to save a date plan");
        }

        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        DatePlan plan = DatePlan.builder()
                .couple(couple)
                .title(request.getTitle())
                .mood(request.getMood())
                .budgetCategory(request.getBudgetCategory())
                .duration(request.getDuration())
                .itineraryJson(request.getItineraryJson())
                .estimatedCost(request.getEstimatedCost())
                .status("PLANNED")
                .build();

        return datePlanRepository.save(plan);
    }
}
