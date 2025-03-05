package com.example.LostAndFound.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.LostAndFound.entity.Item;
import com.example.LostAndFound.repository.ItemRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    // Save an item
    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }


}
