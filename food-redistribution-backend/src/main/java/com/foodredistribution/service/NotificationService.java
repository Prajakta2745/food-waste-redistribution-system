package com.foodredistribution.service;

import com.foodredistribution.dto.response.NotificationResponse;
import com.foodredistribution.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message, String type);
    Page<NotificationResponse> getUserNotifications(Pageable pageable);
    List<NotificationResponse> getRecentNotifications();
    long getUnreadCount();
    void markAsRead(Long notificationId);
    void markAllAsRead();
}
