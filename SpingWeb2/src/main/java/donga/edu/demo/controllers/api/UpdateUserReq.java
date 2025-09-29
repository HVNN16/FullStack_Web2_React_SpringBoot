package donga.edu.demo.controllers.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserReq(
        String name,
        @Email(message = "Invalid email") String email,
        @Size(min = 6, message = "Password must be at least 6 chars") String password,
        String role
) {}
