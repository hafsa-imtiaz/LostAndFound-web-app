package com.example.LostAndFound.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.LostAndFound.dto.LostItemView;
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

    @GetMapping("/lost-old")
    public List<Item> getLostItemsOld() {
    return itemRepository.findByStatus(ItemStatus.claimed);
    }

    @GetMapping("/lost")
    public List<LostItemView> getLostItems() {
    return itemRepository.findItemsWithUsernameByStatus("lost");
    }

    @GetMapping("/claimed-old")  
    public List<Item> getClaimedItemsOld() { 
        return itemRepository.findByStatus(ItemStatus.claimed); 
    }

    @GetMapping("/claimed")  
    public List<LostItemView> getClaimedItems() { 
        return itemRepository.findItemsWithUsernameByStatus("claimed"); 
    }

    @GetMapping("/found-old")  
    public List<Item> getFoundItemsOld() { 
        return itemRepository.findByStatus(ItemStatus.found); 
    }
    
    @GetMapping("/found")  
    public List<LostItemView> getFoundItems() { 
        return itemRepository.findItemsWithUsernameByStatus("found"); 
    }

    @GetMapping("/filter")
    public List<Item> filterItems(
        @RequestParam(value = "searchQuery", required = false) String searchQuery,
        @RequestParam(value = "itemType", required = false) String itemType,
        @RequestParam(value = "status", required = false) String status,
        @RequestParam(value = "filterDate", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime filterDate
    ) {
        return itemService.searchItems(searchQuery, itemType, status, filterDate);
    }
    

    // Or a simple getAll if you prefer:
    @GetMapping("/all")
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    
     @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(item);
    }
    
    
    @PutMapping("/{id}/claim")
    public ResponseEntity<String> claimItem(@PathVariable Long id) {
        boolean success = itemService.claimItem(id);
        if (success) {
            return ResponseEntity.ok("Item claimed successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item not found or already claimed.");
        }
    }


    @PostMapping("/report")
    public ResponseEntity<?> reportItem(@RequestBody ReportItemRequest request) {
        try {
            // Create a new Item entity
            Item item = new Item();
    
            // Retrieve userId from the request
            Long userId = request.getUserId();    
            // Set the userId
            item.setUserId(userId);
    
            // Map other fields
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
    
            // Decode base64 image and set it as BLOB
            if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
                byte[] imageBytes = ItemService.compressImage(request.getImageBase64(), 600, 600);
                item.setItemImage(imageBytes);
            }
    
            // 2. Save via service
            Item savedItem = itemService.saveItem(item);
            System.out.println("\n\n\n\nn\n\n\n\n\nn\n\n\n\n\n" + savedItem.toString());
    
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
    private String imageBase64;        // filename or path
    private long userId;

    public long getUserId(){
        return userId;
    }

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

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String image) { this.imageBase64 = image; }
}
