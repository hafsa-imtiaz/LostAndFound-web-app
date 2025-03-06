package com.example.LostAndFound.dto;

import java.util.List;

public class DashboardResponse {
    private String fullName;       // or firstName, or username
    private long lostCount;        // number of lost items by this user
    private long foundCount;       // number of found items by this user
    private long claimedCount;     // number of claimed items by this user
    private List<ItemDto> recentItems;

    // Getters & setters
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public long getLostCount() {
        return lostCount;
    }
    public void setLostCount(long lostCount) {
        this.lostCount = lostCount;
    }
    public long getFoundCount() {
        return foundCount;
    }
    public void setFoundCount(long foundCount) {
        this.foundCount = foundCount;
    }
    public long getClaimedCount() {
        return claimedCount;
    }
    public void setClaimedCount(long claimedCount) {
        this.claimedCount = claimedCount;
    }
    public List<ItemDto> getRecentItems() {
        return recentItems;
    }
    public void setRecentItems(List<ItemDto> recentItems) {
        this.recentItems = recentItems;
    }
}