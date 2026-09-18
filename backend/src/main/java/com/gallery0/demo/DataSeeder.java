package com.gallery0.demo;

import com.gallery0.demo.domain.Artwork;
import com.gallery0.demo.domain.User;
import com.gallery0.demo.repository.ArtworkRepository;
import com.gallery0.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;

    public DataSeeder(ArtworkRepository artworkRepository, UserRepository userRepository) {
        this.artworkRepository = artworkRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (artworkRepository.count() > 0) {
            return;
        }

        User demoSeller = new User();
        demoSeller.setDisplayName("GALLERY 0 DEMO");
        userRepository.save(demoSeller);

        seed(demoSeller, "Blue Room", "キム・ダヘ", new BigDecimal("800000"), "PAINTING", "ON_SALE", 2024,
                "キャンバスに油彩", new BigDecimal("53"), new BigDecimal("45.5"),
                "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85");
        seed(demoSeller, "Soft Geometry", "パク・ソユン", new BigDecimal("1200000"), "OBJECT", "ON_SALE", 2024,
                null, null, null,
                "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85");
        seed(demoSeller, "A Quiet Day", "イ・ミンジュ", new BigDecimal("700000"), "PHOTOGRAPHY", "SOLD", 2023,
                null, null, null,
                "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1400&q=85");
        seed(demoSeller, "Light in Between", "ハン・ジユ", new BigDecimal("950000"), "PAINTING", "ON_SALE", 2024,
                null, null, null,
                "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=85");
    }

    private void seed(User seller, String title, String artist, BigDecimal price, String category, String status,
                       int year, String material, BigDecimal width, BigDecimal height, String imageUrl) {
        Artwork artwork = new Artwork();
        artwork.setSeller(seller);
        artwork.setTitle(title);
        artwork.setArtistName(artist);
        artwork.setPrice(price);
        artwork.setCategory(category);
        artwork.setStatus(status);
        artwork.setProductionYear(year);
        artwork.setMaterial(material);
        artwork.setWidth(width);
        artwork.setHeight(height);
        artwork.setImageUrl(imageUrl);
        artwork.setShippingInfo("ご注文後 7〜10日");
        artworkRepository.save(artwork);
    }
}
