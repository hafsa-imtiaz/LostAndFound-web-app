package com.example.LostAndFound.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.LostAndFound.dto.LostItemView;
import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.entity.ItemStatus;;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
        @Query(value = """
        SELECT i.item_id AS itemId,
               i.item_name AS itemName,
               i.item_type AS itemType,
               i.description AS description,
               i.location AS location,
               i.date_reported AS dateReported,
               i.status AS status,
               i.image_path AS imagePath,
               u.username AS username
        FROM items i
        JOIN users u ON i.user_id = u.user_id
        WHERE i.status = :status
    """, nativeQuery = true)
    List<LostItemView> findItemsWithUsernameByStatus(@Param("status") String status);

        long countByUserIdAndStatus(Long userId, ItemStatus status);
        // Return top 5 by dateReported desc
        List<Item> findTop5ByUserIdOrderByDateReportedDesc(Long userId);
        List<Item> findByStatus(ItemStatus status);

}
