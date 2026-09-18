package com.gallery0.demo.repository;

import com.gallery0.demo.domain.Purchase;
import com.gallery0.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByBuyerOrderByCreatedAtDesc(User buyer);
}
