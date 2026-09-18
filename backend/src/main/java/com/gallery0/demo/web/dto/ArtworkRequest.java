package com.gallery0.demo.web.dto;

import java.math.BigDecimal;

public record ArtworkRequest(
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
        String shippingInfo
) {
}
