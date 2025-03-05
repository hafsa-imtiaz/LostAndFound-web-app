package com.example.LostAndFound.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "user_id", nullable = false)
    private Long userId;  // ID of the user who reported the item

    @Column(name = "category_id", nullable = true)
    private Long categoryId;  // optional category reference

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('lost','found','claimed','returned') default 'lost'")
    private ItemStatus status;

    @Column(name = "date_reported")
    private LocalDateTime dateReported = LocalDateTime.now();

    @Column(name = "image_path", length = 255)
    private String imagePath;

    // --- Constructors ---
    public Item() {
    }

    public Item(Long userId, Long categoryId, String itemName, String description,
                String location, ItemStatus status, LocalDateTime dateReported, String imagePath) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.itemName = itemName;
        this.description = description;
        this.location = location;
        this.status = status;
        this.dateReported = dateReported;
        this.imagePath = imagePath;
    }

    // --- Getters and Setters ---
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public LocalDateTime getDateReported() {
        return dateReported;
    }

    public void setDateReported(LocalDateTime dateReported) {
        this.dateReported = dateReported;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
