package com.oceanspirit.repository;

import com.oceanspirit.model.Ad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    Page<Ad> findByIsActiveTrue(Pageable pageable);
    Page<Ad> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("SELECT a FROM Ad a WHERE " +
            "(LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "a.isActive = true")
    Page<Ad> searchByTitleOrDescription(@Param("query") String query, Pageable pageable);

    List<Ad> findByAuthorIdAndIsActiveTrue(Long authorId);
    List<Ad> findByAuthorId(Long authorId);
    boolean existsByIdAndAuthorId(Long id, Long authorId);
}