package com.example.LostAndFound.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.LostAndFound.entity.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
}
