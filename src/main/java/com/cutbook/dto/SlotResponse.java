package com.cutbook.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

// Ui tarafina dondurulecek uygun slot listesi
@Data
@AllArgsConstructor
public class SlotResponse {
    private String date;
    private List<String> availableTimes;
}