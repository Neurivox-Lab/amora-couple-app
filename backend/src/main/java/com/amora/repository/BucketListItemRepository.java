package com.amora.repository;

import com.amora.model.BucketListItem;
import com.amora.model.Couple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BucketListItemRepository extends JpaRepository<BucketListItem, Long> {
    List<BucketListItem> findByCoupleOrderByCreatedAtDesc(Couple couple);
    List<BucketListItem> findByCoupleAndCategory(Couple couple, String category);
}
