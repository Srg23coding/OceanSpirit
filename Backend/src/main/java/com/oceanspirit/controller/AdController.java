package com.oceanspirit.controller;

import com.oceanspirit.dto.request.CreateAdRequest;
import com.oceanspirit.dto.request.UpdateAdRequest;
import com.oceanspirit.dto.response.AdResponse;
import com.oceanspirit.service.AdService;
import com.oceanspirit.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/ads")
public class AdController {

    @Autowired
    private AdService adService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<Page<AdResponse>> getAds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        Sort sort = Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AdResponse> ads = adService.getAds(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AdResponse>> searchAds(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<AdResponse> ads = adService.searchAds(query, pageable);
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdResponse> getAd(@PathVariable Long id) {
        AdResponse ad = adService.getAdById(id);
        return ResponseEntity.ok(ad);
    }

    @PostMapping
    public ResponseEntity<AdResponse> createAd(
            @Valid @RequestBody CreateAdRequest request,
            HttpServletRequest httpRequest) {

        Long userId = extractUserIdFromRequest(httpRequest);
        AdResponse ad = adService.createAd(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdResponse> updateAd(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdRequest request,
            HttpServletRequest httpRequest) {

        Long userId = extractUserIdFromRequest(httpRequest);
        AdResponse ad = adService.updateAd(id, request, userId);
        return ResponseEntity.ok(ad);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAd(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        Long userId = extractUserIdFromRequest(httpRequest);
        adService.deleteAd(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/me/ads")
    public ResponseEntity<List<AdResponse>> getUserAds(
            HttpServletRequest httpRequest) {

        Long userId = extractUserIdFromRequest(httpRequest);
        List<AdResponse> ads = adService.getUserAds(userId);
        return ResponseEntity.ok(ads);
    }

    private Long extractUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extractUserId(token);
        }
        throw new RuntimeException("Токен не найден");
    }
}