package com.example.LostAndFound.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.entity.ItemStatus;
import com.example.LostAndFound.repository.ItemRepository;
import com.example.LostAndFound.service.ItemService;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // Allow from anywhere or specify your domain
public class ItemController {

    private final ItemService itemService;

    // Constructor injection
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }
    
    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/lost")  // e.g. returns all 'lost' items
    public List<Item> getLostItems() { 
        return itemRepository.findByStatus(ItemStatus.lost); 
    }
    
    // Or a simple getAll if you prefer:
    @GetMapping("/all")
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    

    // 1. Report item
    @PostMapping("/report")
    public ResponseEntity<?> reportItem(@RequestBody ReportItemRequest request) {
        try {
            // Create a new Item entity
            Item item = new Item();

            // Hard-coded user ID for example; in real code, get from auth or pass from frontend
            item.setUserId(1L);

            // Map fields
            item.setItemName(request.getItemName());
            item.setItemType(request.getItemType());
            item.setDescription(request.getDescription());
            item.setLocation(request.getLocation());
            
            // Convert string to enum, default to LOST if unknown
            ItemStatus status;
            switch (request.getStatus().toLowerCase()) {
                case "found" -> status = ItemStatus.found;
                case "claimed" -> status = ItemStatus.claimed;
                case "returned" -> status = ItemStatus.returned;
                default -> status = ItemStatus.lost;
            }
            item.setStatus(status);



            // If you want to store date in dateReported, you can parse request.getDate() 
            //item.setDateReported(LocalDateTime.parse(request.getDate(), DateTimeFormatter.ISO_DATE)); 
            // Or just rely on default timestamp

            // For the image, store the filename or path
            item.setImagePath(request.getImage());

            // 2. Save via service
            Item savedItem = itemService.saveItem(item);

            // 3. Send response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Item reported successfully!");
            response.put("item", savedItem);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("message", "Failed to report item: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorMap);
        }
    }
    
}

class ReportItemRequest {
    private String itemType;     // "lost" / "found"
    private String itemName;
    private String status;
    private String description;
    private String location;
    private String date;         // "yyyy-mm-dd"
    private String image;        // filename or path

    // Getters and setters
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
