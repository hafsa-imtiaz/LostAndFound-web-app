package com.example.LostAndFound.dto;

import java.time.LocalDateTime;

public interface LostItemView {
    Long getItemId();
    String getItemName();
    String getItemType();
    String getDescription();
    String getLocation();
    String getStatus();
    String getImagePath();
    LocalDateTime getDateReported(); // instead of Date
    String getUsername();
}
