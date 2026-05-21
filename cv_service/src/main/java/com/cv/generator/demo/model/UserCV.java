package com.cv.generator.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Document(collection = "user_cvs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UseCV {
    private String id;
    private UUID userId;
    private String cvType;
    private ProfileInfo profileInfo;
    private List<Education> educations;
    private List<WorkExperience> experiences;
    private Map<String,Object> dynamicSection;
    private LocalDateTime createdAt=LocalDateTime.now();
    private LocalDateTime updatedAt=LocalDateTime.now();

}
