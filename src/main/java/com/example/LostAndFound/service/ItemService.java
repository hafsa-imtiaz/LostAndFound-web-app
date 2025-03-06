package com.example.LostAndFound.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.LostAndFound.dto.DashboardResponse;
import com.example.LostAndFound.dto.ItemDto;
import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.entity.ItemStatus;
import com.example.LostAndFound.entity.User;
import com.example.LostAndFound.repository.ItemRepository;
import com.example.LostAndFound.repository.UserRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;
    
    public Item saveItem(Item item) {
        return itemRepository.save(item);
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
        long lostCount = itemRepository.countByUserIdAndStatus(userId, ItemStatus.LOST);
        long foundCount = itemRepository.countByUserIdAndStatus(userId, ItemStatus.FOUND);
        long claimedCount = itemRepository.countByUserIdAndStatus(userId, ItemStatus.CLAIMED);
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
}
