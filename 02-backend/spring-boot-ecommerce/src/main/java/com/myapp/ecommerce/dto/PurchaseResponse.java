package com.myapp.ecommerce.dto;

import lombok.*;

@Data  // create constructor for final fields

//@AllArgsConstructor
public class PurchaseResponse {

//    @NonNull
    private final String orderTrackingNumber;
}
