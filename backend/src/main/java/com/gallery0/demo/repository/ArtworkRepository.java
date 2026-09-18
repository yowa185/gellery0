package com.gallery0.demo.repository;

import com.gallery0.demo.domain.Artwork;
import com.gallery0.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findAllByOrderByCreatedAtDesc();

    List<Artwork> findByCategoryOrderByCreatedAtDesc(String category);

    List<Artwork> findBySellerOrderByCreatedAtDesc(User seller);
}
