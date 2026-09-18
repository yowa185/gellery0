package com.gallery0.demo.repository;

import com.gallery0.demo.domain.Artwork;
import com.gallery0.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findAllByOrderByCreatedAtDesc();

    List<Artwork> findByCategoryOrderByCreatedAtDesc(String category);

    List<Artwork> findBySellerOrderByCreatedAtDesc(User seller);

    // Atomic conditional update: only reserves the artwork if it is still ON_SALE,
    // so two concurrent purchase requests for the same artwork can't both succeed.
    @Modifying
    @Query("UPDATE Artwork a SET a.status = 'RESERVED' WHERE a.id = :id AND a.status = 'ON_SALE'")
    int reserveIfOnSale(@Param("id") Long id);
}
