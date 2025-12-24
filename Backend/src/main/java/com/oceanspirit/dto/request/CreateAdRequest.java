package com.oceanspirit.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CreateAdRequest {
    @NotBlank(message = "Заголовок обязателен")
    @Size(min = 3, max = 100, message = "Заголовок должен содержать от 3 до 100 символов")
    private String title;

    @Size(max = 2000, message = "Описание не должно превышать 2000 символов")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Цена должна быть положительной")
    private BigDecimal price;

    private String imageData;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageData() { return imageData; }
    public void setImageData(String imageData) { this.imageData = imageData; }
}