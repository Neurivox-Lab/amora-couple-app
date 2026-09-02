package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Long> {
    List<Memory> findByCoupleOrderByMemoryDateDesc(Couple couple);
    List<Memory> findByCoupleAndIsFavoriteTrueOrderByMemoryDateDesc(Couple couple);
}
