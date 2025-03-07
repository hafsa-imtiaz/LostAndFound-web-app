package com.example.LostAndFound.repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.LostAndFound.dto.LostItemView;
import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.entity.ItemStatus;

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


        @Query("""
        SELECT i
        FROM Item i
        WHERE 
                (:category IS NULL OR :category = '' OR i.itemType = :category)
                AND (:status IS NULL OR :status = '' OR i.status = :status)
                AND (:date IS NULL OR FUNCTION('DATE', i.dateReported) = :date)
        """)
        List<Item> searchWithFilters(
                @Param("category") String category,
                @Param("status") String status,
                @Param("date") LocalDate date
        );

    List<Item> findAllByItemNameContainingIgnoreCaseAndItemTypeContainingIgnoreCaseAndStatusAndDateReportedAfter(
            String itemName, String itemType, ItemStatus status, LocalDateTime dateReported);

    // Find items by item name containing search query, item type, and status
    List<Item> findAllByItemNameContainingIgnoreCaseAndItemTypeContainingIgnoreCaseAndStatus(
            String itemName, String itemType, ItemStatus status);

    // Find items by item name containing search query and item type
    List<Item> findAllByItemNameContainingIgnoreCaseAndItemTypeContainingIgnoreCase(
            String itemName, String itemType);

    // Find items by item name containing search query and status
    List<Item> findAllByItemNameContainingIgnoreCaseAndStatus(
            String itemName, ItemStatus status);

    // Find items by item type and status
    List<Item> findAllByItemTypeContainingIgnoreCaseAndStatus(
            String itemType, ItemStatus status);

    // Find items by item type
    List<Item> findAllByItemTypeContainingIgnoreCase(String itemType);

    // Find items by status
    List<Item> findAllByStatus(ItemStatus status);

    // Find items reported after a specific date
    List<Item> findAllByDateReportedAfter(LocalDateTime dateReported);

    List<Item> findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String searchQuery1, String searchQuery2);

}
