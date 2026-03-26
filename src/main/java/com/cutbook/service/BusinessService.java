package com.cutbook.service;

import com.cutbook.dto.BusinessDto;
import com.cutbook.dto.ServiceDto;
import com.cutbook.model.Business;
import com.cutbook.model.User;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.ServiceRepository;
import com.cutbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    // Isletme olusturma (FR03)
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

    // Tum isletmeleri listeleme (FR02)
    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    // Isletme detayi getirme (FR02)
    public Business getBusinessById(Long id) {
        return businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Isletme bulunamadi"));
    }

    // Isletme bilgisi guncelleme (FR11)
    public Business updateBusiness(Long id, BusinessDto dto) {
        Business business = getBusinessById(id);
        business.setName(dto.getName());
        business.setDescription(dto.getDescription());
        business.setPhone(dto.getPhone());
        business.setAddress(dto.getAddress());
        return businessRepository.save(business);
    }

    // Isletmeye hizmet ekleme (FR11)
    public com.cutbook.model.Service addServiceToBusiness(Long businessId, ServiceDto dto) {
        Business business = getBusinessById(businessId);

        com.cutbook.model.Service service = new com.cutbook.model.Service();
        service.setBusiness(business);
        service.setName(dto.getName());
        service.setDurationMinutes(dto.getDurationMinutes());
        service.setPrice(dto.getPrice());

        return serviceRepository.save(service);
    }

    // Isletmenin hizmetlerini listeleme
    public List<com.cutbook.model.Service> getBusinessServices(Long businessId) {
        return serviceRepository.findByBusinessId(businessId);
    }
}