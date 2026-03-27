package com.cutbook.service.impl;

import com.cutbook.dto.BusinessDto;
import com.cutbook.dto.ServiceDto;
import com.cutbook.model.Business;
import com.cutbook.model.User;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.ServiceRepository;
import com.cutbook.repository.UserRepository;
import com.cutbook.service.BusinessService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public Business createBusiness(BusinessDto dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Isletme sahibi bulunamadi"));

        Business business = new Business();
        business.setOwner(owner);
        business.setName(dto.getName());
        business.setDescription(dto.getDescription());
        business.setPhone(dto.getPhone());
        business.setAddress(dto.getAddress());
        business.setCreatedAt(LocalDateTime.now());

        return businessRepository.save(business);
    }

    @Override
    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    @Override
    public Business getBusinessById(Long id) {
        return businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Isletme bulunamadi"));
    }

    @Override
    public Business updateBusiness(Long id, BusinessDto dto) {
        Business business = getBusinessById(id);
        business.setName(dto.getName());
        business.setDescription(dto.getDescription());
        business.setPhone(dto.getPhone());
        business.setAddress(dto.getAddress());
        return businessRepository.save(business);
    }

    @Override
    public com.cutbook.model.Service addServiceToBusiness(Long businessId, ServiceDto dto) {
        Business business = getBusinessById(businessId);

        com.cutbook.model.Service service = new com.cutbook.model.Service();
        service.setBusiness(business);
        service.setName(dto.getName());
        service.setDurationMinutes(dto.getDurationMinutes());
        service.setPrice(dto.getPrice());

        return serviceRepository.save(service);
    }

    @Override
    public List<com.cutbook.model.Service> getBusinessServices(Long businessId) {
        return serviceRepository.findByBusinessId(businessId);
    }
}