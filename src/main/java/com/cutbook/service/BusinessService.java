package com.cutbook.service;

import com.cutbook.dto.BusinessDto;
import com.cutbook.dto.ServiceDto;
import com.cutbook.model.Business;
import java.util.List;

public interface BusinessService {
    Business createBusiness(BusinessDto dto);
    List<Business> getAllBusinesses();
    Business getBusinessById(Long id);
    Business updateBusiness(Long id, BusinessDto dto);
    com.cutbook.model.Service addServiceToBusiness(Long businessId, ServiceDto dto);
    List<com.cutbook.model.Service> getBusinessServices(Long businessId);
}