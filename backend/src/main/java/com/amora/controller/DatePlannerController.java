package com.amora.controller;

import com.amora.dto.DatePlanRequest;
import com.amora.model.DatePlan;
import com.amora.security.UserPrincipal;
import com.amora.service.DatePlannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/date-plans")
@RequiredArgsConstructor
public class DatePlannerController {

    private final DatePlannerService datePlannerService;

    @GetMapping
    public ResponseEntity<List<DatePlan>> getPlans(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(datePlannerService.getPlans(principal.getUser()));
    }

    @PostMapping
    public ResponseEntity<DatePlan> savePlan(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestBody DatePlanRequest request) {
        return ResponseEntity.ok(datePlannerService.savePlan(principal.getUser(), request));
    }
}
