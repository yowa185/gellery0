package com.gallery0.demo.web;

import com.gallery0.demo.domain.Artwork;
import com.gallery0.demo.domain.User;
import com.gallery0.demo.repository.ArtworkRepository;
import com.gallery0.demo.repository.PurchaseRepository;
import com.gallery0.demo.service.VisitorService;
import com.gallery0.demo.web.dto.ArtworkDetail;
import com.gallery0.demo.web.dto.ArtworkRequest;
import com.gallery0.demo.web.dto.ArtworkSummary;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    private final ArtworkRepository artworkRepository;
    private final PurchaseRepository purchaseRepository;
    private final VisitorService visitorService;

    public ArtworkController(ArtworkRepository artworkRepository, PurchaseRepository purchaseRepository,
                              VisitorService visitorService) {
        this.artworkRepository = artworkRepository;
        this.purchaseRepository = purchaseRepository;
        this.visitorService = visitorService;
    }

    @GetMapping
    public List<ArtworkSummary> list(@RequestParam(required = false) String category) {
        List<Artwork> artworks = (category == null || category.isBlank() || category.equalsIgnoreCase("all"))
                ? artworkRepository.findAllByOrderByCreatedAtDesc()
                : artworkRepository.findByCategoryOrderByCreatedAtDesc(category.toUpperCase());
        return artworks.stream().map(this::toSummary).toList();
    }

    @GetMapping("/mine")
    public List<ArtworkSummary> mine(@RequestHeader("X-Visitor-Token") String visitorToken) {
        User visitor = visitorService.resolve(visitorToken);
        return artworkRepository.findBySellerOrderByCreatedAtDesc(visitor).stream().map(this::toSummary).toList();
    }

    @GetMapping("/{id}")
    public ArtworkDetail get(@PathVariable Long id,
                              @RequestHeader(value = "X-Visitor-Token", required = false) String visitorToken) {
        Artwork artwork = findOrThrow(id);
        boolean own = visitorToken != null
                && artwork.getSeller().getVisitorToken().toString().equals(visitorToken);
        return toDetail(artwork, own);
    }

    @PostMapping
    public ArtworkDetail create(@RequestBody ArtworkRequest request,
                                 @RequestHeader("X-Visitor-Token") String visitorToken) {
        User seller = visitorService.resolve(visitorToken);
        Artwork artwork = new Artwork();
        applyRequest(artwork, request);
        artwork.setSeller(seller);
        artworkRepository.save(artwork);
        return toDetail(artwork, true);
    }

    @PutMapping("/{id}")
    public ArtworkDetail update(@PathVariable Long id,
                                 @RequestBody ArtworkRequest request,
                                 @RequestHeader("X-Visitor-Token") String visitorToken) {
        Artwork artwork = findOrThrow(id);
        User visitor = visitorService.resolve(visitorToken);
        if (!artwork.getSeller().getId().equals(visitor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your listing");
        }
        applyRequest(artwork, request);
        artworkRepository.save(artwork);
        return toDetail(artwork, true);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestHeader("X-Visitor-Token") String visitorToken) {
        Artwork artwork = findOrThrow(id);
        User visitor = visitorService.resolve(visitorToken);
        if (!artwork.getSeller().getId().equals(visitor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your listing");
        }
        if (purchaseRepository.existsByArtworkId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Artwork already has purchase requests");
        }
        artworkRepository.delete(artwork);
    }

    private Artwork findOrThrow(Long id) {
        return artworkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private void applyRequest(Artwork artwork, ArtworkRequest request) {
        artwork.setTitle(request.title());
        artwork.setArtistName(request.artistName());
        artwork.setDescription(request.description());
        artwork.setPrice(request.price());
        artwork.setWidth(request.width());
        artwork.setHeight(request.height());
        artwork.setMaterial(request.material());
        artwork.setProductionYear(request.productionYear());
        artwork.setCategory(request.category());
        artwork.setImageUrl(request.imageUrl());
        artwork.setShippingInfo(request.shippingInfo());
    }

    private ArtworkSummary toSummary(Artwork artwork) {
        return new ArtworkSummary(artwork.getId(), artwork.getTitle(), artwork.getArtistName(), artwork.getPrice(),
                artwork.getImageUrl(), artwork.getCategory(), artwork.getStatus(), artwork.getProductionYear(),
                artwork.getCreatedAt());
    }

    private ArtworkDetail toDetail(Artwork artwork, boolean own) {
        return new ArtworkDetail(artwork.getId(), artwork.getTitle(), artwork.getArtistName(),
                artwork.getDescription(), artwork.getPrice(), artwork.getWidth(), artwork.getHeight(),
                artwork.getMaterial(), artwork.getProductionYear(), artwork.getCategory(), artwork.getImageUrl(),
                artwork.getShippingInfo(), artwork.getStatus(), own);
    }
}
