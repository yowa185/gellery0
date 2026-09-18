package com.gallery0.demo.web;

import com.gallery0.demo.domain.Artwork;
import com.gallery0.demo.domain.Purchase;
import com.gallery0.demo.domain.User;
import com.gallery0.demo.repository.ArtworkRepository;
import com.gallery0.demo.repository.PurchaseRepository;
import com.gallery0.demo.service.VisitorService;
import com.gallery0.demo.web.dto.PurchaseRequest;
import com.gallery0.demo.web.dto.PurchaseSummary;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final ArtworkRepository artworkRepository;
    private final VisitorService visitorService;

    public PurchaseController(PurchaseRepository purchaseRepository, ArtworkRepository artworkRepository,
                               VisitorService visitorService) {
        this.purchaseRepository = purchaseRepository;
        this.artworkRepository = artworkRepository;
        this.visitorService = visitorService;
    }

    @GetMapping("/mine")
    public List<PurchaseSummary> mine(@RequestHeader("X-Visitor-Token") String visitorToken) {
        User buyer = visitorService.resolve(visitorToken);
        return purchaseRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream().map(this::toSummary).toList();
    }

    @PostMapping
    public PurchaseSummary create(@RequestBody PurchaseRequest request,
                                   @RequestHeader("X-Visitor-Token") String visitorToken) {
        Artwork artwork = artworkRepository.findById(request.artworkId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!"ON_SALE".equals(artwork.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Artwork is not available");
        }
        User buyer = visitorService.resolve(visitorToken);

        Purchase purchase = new Purchase();
        purchase.setArtwork(artwork);
        purchase.setBuyer(buyer);
        purchase.setPrice(artwork.getPrice());
        purchaseRepository.save(purchase);

        artwork.setStatus("RESERVED");
        artworkRepository.save(artwork);

        return toSummary(purchase);
    }

    private PurchaseSummary toSummary(Purchase purchase) {
        Artwork artwork = purchase.getArtwork();
        return new PurchaseSummary(purchase.getId(), artwork.getId(), artwork.getTitle(), artwork.getArtistName(),
                artwork.getImageUrl(), purchase.getPrice(), purchase.getStatus(), purchase.getCreatedAt());
    }
}
