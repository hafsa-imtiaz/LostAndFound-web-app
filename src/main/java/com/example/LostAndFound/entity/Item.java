package com.example.LostAndFound.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_type", nullable = true)
    private String itemType;  // e.g. "Electronics", "Clothing", etc.

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('lost','found','claimed','returned') default 'lost'")
    private ItemStatus status;  // Java enum

    @Column(name = "date_reported", updatable = false, insertable = false)
    private LocalDateTime dateReported = LocalDateTime.now();

    @Lob
    @Column(name = "item_image")
    private byte[] itemImage; 

    // Constructors
    public Item() {
    }

    // Getters and setters
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
    public String getItemName() {
        return itemName;
    }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    public String getItemType() {
        return itemType;
    }
    public void setItemType(String itemType) {
        this.itemType = itemType;
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
    public byte[] getItemImage() {
        return itemImage;
    }
    public void setItemImage(byte[] itemImage) {
        this.itemImage = itemImage;
    }

    @Override
    public String toString() {
        return "Item{" +
            "itemId=" + itemId +
            ", userId=" + userId +
            ", itemName='" + itemName + '\'' +
            ", itemType='" + itemType + '\'' +
            ", description='" + description + '\'' +
            ", location='" + location + '\'' +
            ", status=" + status +
            ", dateReported=" + dateReported +
            ", itemImage=" + (itemImage != null ? "[binary data]" : "null") +
            '}';
    }

}
