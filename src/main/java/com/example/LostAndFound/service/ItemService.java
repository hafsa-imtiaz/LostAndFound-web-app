package com.example.LostAndFound.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.LostAndFound.dto.DashboardResponse;
import com.example.LostAndFound.dto.ItemDto;
import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.entity.ItemStatus;
import com.example.LostAndFound.entity.User;
import com.example.LostAndFound.repository.ItemRepository;
import com.example.LostAndFound.repository.UserRepository;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;
    
    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }
    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }
    
   public List<Item> searchItems(String category, String status, LocalDate date) {
        ItemStatus itemStatus;
        
        try {
            itemStatus = ItemStatus.valueOf(status.toLowerCase()); // Convert string to enum
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }
        
        return itemRepository.findByStatus(itemStatus);
    }

    
    public DashboardResponse getDashboardData(Long userId) {
        DashboardResponse dto = new DashboardResponse();
        
        // 1. Get user name
        User user = userRepository.findById(userId)
                      .orElseThrow(() -> new RuntimeException("User not found"));

        // Combine first & last names or use user.getUsername()
        String fullName = user.getFirstName() + " " + user.getLastName();
        dto.setFullName(fullName);

        // 2. Count items by status
        long lostCount = itemRepository.countByUserIdAndStatus(userId, ItemStatus.lost);
        long foundCount = itemRepository.countByUserIdAndStatus(userId, ItemStatus.found);
        long claimedCount = itemRepository.countByUserIdAndStatus(userId, ItemStatus.claimed);
        // If you want returned count: itemRepository.countByUserIdAndStatus(userId, ItemStatus.RETURNED);

        dto.setLostCount(lostCount);
        dto.setFoundCount(foundCount);
        dto.setClaimedCount(claimedCount);

        // 3. Query the user's recent items
        List<Item> recentItems = itemRepository
             .findTop5ByUserIdOrderByDateReportedDesc(userId); // or however you want to limit

        // Convert to ItemDto
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<ItemDto> recentItemDtos = recentItems.stream()
            .map(item -> new ItemDto(
                item.getItemId(),
                item.getItemName(),
                item.getItemType(),
                item.getDateReported().format(formatter),
                item.getStatus().name() // or a nicer string
            ))
            .collect(Collectors.toList());

        dto.setRecentItems(recentItemDtos);

        return dto;
    }

    public static byte[] compressImage(String base64Image, int targetWidth, int targetHeight) throws IOException {
        // Step 1: Decode the Base64 image string into a byte array
        byte[] decodedImage = Base64.getDecoder().decode(base64Image);

        // Step 2: Resize and compress the image using Thumbnailator
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(decodedImage))
                .size(targetWidth, targetHeight)  // Resize to target dimensions
                .outputFormat("jpg")  // Compress to JPEG
                .toOutputStream(byteArrayOutputStream);

        return byteArrayOutputStream.toByteArray();
    }

    public List<Item> searchItems(String searchQuery, String itemType, String status, LocalDateTime filterDate) {
        if(status != null) status = status.toLowerCase();

        if (searchQuery != null && !searchQuery.isEmpty() && itemType != null && !itemType.isEmpty() && status != null && !status.isEmpty() && filterDate != null) {
            // All filters provided
            return itemRepository.findAllByItemNameContainingIgnoreCaseAndItemTypeContainingIgnoreCaseAndStatusAndDateReportedAfter(
                searchQuery, itemType, ItemStatus.valueOf(status), filterDate);
        } else if (searchQuery != null && !searchQuery.isEmpty() && itemType != null && !itemType.isEmpty() && status != null && !status.isEmpty()) {
            // Only search query, itemType, and status provided
            return itemRepository.findAllByItemNameContainingIgnoreCaseAndItemTypeContainingIgnoreCaseAndStatus(
                searchQuery, itemType, ItemStatus.valueOf(status));
        } else if (searchQuery != null && !searchQuery.isEmpty() && itemType != null && !itemType.isEmpty()) {
            // Only search query and itemType provided
            return itemRepository.findAllByItemNameContainingIgnoreCaseAndItemTypeContainingIgnoreCase(
                searchQuery, itemType);
        } else if (searchQuery != null && !searchQuery.isEmpty() && status != null && !status.isEmpty()) {
            // Only search query and status provided
            return itemRepository.findAllByItemNameContainingIgnoreCaseAndStatus(
                searchQuery, ItemStatus.valueOf(status));
        } else if (itemType != null && !itemType.isEmpty() && status != null && !status.isEmpty()) {
            // Only itemType and status provided
            return itemRepository.findAllByItemTypeContainingIgnoreCaseAndStatus(
                itemType, ItemStatus.valueOf(status));
        } else if (itemType != null && !itemType.isEmpty()) {
            // Only itemType provided
            return itemRepository.findAllByItemTypeContainingIgnoreCase(itemType);
        } else if (status != null && !status.isEmpty()) {
            // Only status provided
            return itemRepository.findAllByStatus(ItemStatus.valueOf(status));
        } else if (filterDate != null) {
            // Only date filter provided
            return itemRepository.findAllByDateReportedAfter(filterDate);
        } else if(searchQuery != null){
            return itemRepository.findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchQuery, searchQuery);
        } else {
            return itemRepository.findAll();
        }
    }
    
    
    public boolean claimItem(Long itemId) {
        Optional<Item> optionalItem = itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            Item item = optionalItem.get();
            if (item.getStatus() == ItemStatus.lost) { // Only allow claiming lost items
                item.setStatus(ItemStatus.claimed); // Update status
                itemRepository.save(item);
                return true;
            }
        }
        return false;
    }

}
