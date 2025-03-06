package com.example.LostAndFound.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.entity.ItemStatus;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {


        long countByUserIdAndStatus(Long userId, ItemStatus status);

        // Return top 5 by dateReported desc
        List<Item> findTop5ByUserIdOrderByDateReportedDesc(Long userId);
        List<Item> findByStatus(String status);

}
