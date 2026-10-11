package com.foodredistribution.service;

import com.foodredistribution.dto.response.AuditLogResponse;
import com.foodredistribution.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {
    void logAction(User user, String action, String entityType, Long entityId, String description);
    Page<AuditLogResponse> getAllAuditLogs(Pageable pageable);
    Page<AuditLogResponse> getAuditLogsByEntity(String entityType, Pageable pageable);
}
