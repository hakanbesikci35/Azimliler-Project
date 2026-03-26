package com.cutbook.controller;

import com.cutbook.dto.BusinessDto;
import com.cutbook.dto.ServiceDto;
import com.cutbook.model.Business;
import com.cutbook.service.BusinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    // FR03
    @PostMapping
    public ResponseEntity<Business> createBusiness(@Valid @RequestBody BusinessDto dto) {
        return ResponseEntity.ok(businessService.createBusiness(dto));
    }

    // FR02
    @GetMapping
    public ResponseEntity<List<Business>> getAllBusinesses() {
        return ResponseEntity.ok(businessService.getAllBusinesses());
    }

    // FR02
    @GetMapping("/{id}")
    public ResponseEntity<Business> getBusinessById(@PathVariable Long id) {
        return ResponseEntity.ok(businessService.getBusinessById(id));
    }

    // FR11
    @PutMapping("/{id}")
    public ResponseEntity<Business> updateBusiness(@PathVariable Long id, @Valid @RequestBody BusinessDto dto) {
        return ResponseEntity.ok(businessService.updateBusiness(id, dto));
    }

    // FR11
    @PostMapping("/{id}/services")
    public ResponseEntity<com.cutbook.model.Service> addService(@PathVariable Long id, @Valid @RequestBody ServiceDto dto) {
        return ResponseEntity.ok(businessService.addServiceToBusiness(id, dto));
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<List<com.cutbook.model.Service>> getServices(@PathVariable Long id) {
        return ResponseEntity.ok(businessService.getBusinessServices(id));
    }
}