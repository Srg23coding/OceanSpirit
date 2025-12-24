package com.oceanspirit.service;

import com.oceanspirit.dto.request.CreateAdRequest;
import com.oceanspirit.dto.request.UpdateAdRequest;
import com.oceanspirit.dto.response.AdResponse;
import com.oceanspirit.exception.AccessDeniedException;
import com.oceanspirit.exception.AdNotFoundException;
import com.oceanspirit.exception.ValidationException;
import com.oceanspirit.model.Ad;
import com.oceanspirit.model.User;
import com.oceanspirit.repository.AdRepository;
import com.oceanspirit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdService {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<AdResponse> getAds(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Ad> ads;

        if (minPrice != null && maxPrice != null) {
            ads = adRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice, pageable);
        } else {
            ads = adRepository.findByIsActiveTrue(pageable);
        }

        return ads.map(this::convertToResponse);
    }

    public Page<AdResponse> searchAds(String query, Pageable pageable) {
        if (query == null || query.trim().length() < 3) {
            throw new ValidationException("Поисковый запрос должен содержать минимум 3 символа");
        }

        Page<Ad> ads = adRepository.searchByTitleOrDescription(query.trim(), pageable);
        return ads.map(this::convertToResponse);
    }

    public AdResponse getAdById(Long id) {
        Ad ad = adRepository.findById(id)
                .orElseThrow(() -> new AdNotFoundException("Объявление не найдено"));

        if (!ad.isActive()) {
            throw new AdNotFoundException("Объявление не найдено или удалено");
        }

        return convertToResponse(ad);
    }

    @Transactional
    public AdResponse createAd(CreateAdRequest request, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ValidationException("Пользователь не найден"));

        validateAdData(request);

        Ad ad = new Ad();
        ad.setTitle(request.getTitle());
        ad.setDescription(request.getDescription());
        ad.setPrice(request.getPrice());
        ad.setImageData(request.getImageData());
        ad.setAuthor(author);
        ad.setActive(true);

        Ad savedAd = adRepository.save(ad);
        return convertToResponse(savedAd);
    }

    @Transactional
    public AdResponse updateAd(Long adId, UpdateAdRequest request, Long userId) {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new AdNotFoundException("Объявление не найдено"));

        if (!ad.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Нет прав на редактирование этого объявления");
        }

        if (!ad.isActive()) {
            throw new AdNotFoundException("Объявление не найдено или удалено");
        }

        updateAdFields(ad, request);
        ad.setUpdatedAt(LocalDateTime.now());
        Ad updatedAd = adRepository.save(ad);
        return convertToResponse(updatedAd);
    }

    @Transactional
    public void deleteAd(Long adId, Long userId) {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new AdNotFoundException("Объявление не найдено"));

        if (!ad.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Нет прав на удаление этого объявления");
        }

        ad.setActive(false);
        adRepository.save(ad);
    }

    public List<AdResponse> getUserAds(Long userId) {
        List<Ad> ads = adRepository.findByAuthorIdAndIsActiveTrue(userId);
        return ads.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private AdResponse convertToResponse(Ad ad) {
        AdResponse response = new AdResponse();
        response.setId(ad.getId());
        response.setTitle(ad.getTitle());
        response.setDescription(ad.getDescription());
        response.setPrice(ad.getPrice());
        response.setCreatedAt(ad.getCreatedAt());
        response.setUpdatedAt(ad.getUpdatedAt());

        return response;
    }

    private void validateAdData(CreateAdRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ValidationException("Заголовок обязателен");
        }
        if (request.getTitle().length() < 3 || request.getTitle().length() > 100) {
            throw new ValidationException("Заголовок должен содержать от 3 до 100 символов");
        }
        if (request.getPrice() == null) {
            throw new ValidationException("Цена обязательна");
        }
        if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Цена должна быть положительной");
        }
        if (request.getDescription() != null && request.getDescription().length() > 2000) {
            throw new ValidationException("Описание не должно превышать 2000 символов");
        }
    }

    private void updateAdFields(Ad ad, UpdateAdRequest request) {
        if (request.getTitle() != null) {
            if (request.getTitle().length() < 3 || request.getTitle().length() > 100) {
                throw new ValidationException("Заголовок должен содержать от 3 до 100 символов");
            }
            ad.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            if (request.getDescription().length() > 2000) {
                throw new ValidationException("Описание не должно превышать 2000 символов");
            }
            ad.setDescription(request.getDescription());
        }

        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException("Цена должна быть положительной");
            }
            ad.setPrice(request.getPrice());
        }

        if (request.getImageData() != null) {
            ad.setImageData(request.getImageData());
        }
    }
}