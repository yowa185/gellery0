package com.gallery0.demo.web.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ArtworkSummary(
        Long id,
        String title,
        String artistName,
        BigDecimal price,
        String imageUrl,
        String category,
        String status,
        Integer productionYear,
        OffsetDateTime createdAt
) {
}
