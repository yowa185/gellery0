package com.gallery0.demo.web.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record PurchaseSummary(
        Long id,
        Long artworkId,
        String title,
        String artistName,
        String imageUrl,
        BigDecimal price,
        String status,
        OffsetDateTime createdAt
) {
}
