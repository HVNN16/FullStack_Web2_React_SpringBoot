package donga.edu.demo.controllers.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserReq(
        @NotBlank(message = "Name is required") String name,
        @NotBlank @Email(message = "Invalid email") String email,
        @NotBlank @Size(min = 6, message = "Password must be at least 6 chars") String password,
        String role
) {}
