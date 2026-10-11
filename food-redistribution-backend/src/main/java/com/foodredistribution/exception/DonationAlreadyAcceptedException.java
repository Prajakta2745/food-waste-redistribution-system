package com.foodredistribution.exception;

public class DonationAlreadyAcceptedException extends RuntimeException {
    public DonationAlreadyAcceptedException(String message) {
        super(message);
    }
}
