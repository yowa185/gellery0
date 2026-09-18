package com.gallery0.demo.web.dto;

import java.math.BigDecimal;

public record ArtworkDetail(
        Long id,
        String title,
        String artistName,
        String description,
        BigDecimal price,
        BigDecimal width,
        BigDecimal height,
        String material,
        Integer productionYear,
        String category,
        String imageUrl,
        String shippingInfo,
        String status,
        boolean own
) {
}
