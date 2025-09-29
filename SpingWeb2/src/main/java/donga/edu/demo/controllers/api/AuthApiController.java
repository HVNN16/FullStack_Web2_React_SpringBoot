package donga.edu.demo.controllers.api;

import donga.edu.demo.models.User;
import donga.edu.demo.repository.UserRepository;
import donga.edu.demo.security.JwtService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthApiController(AuthenticationManager authenticationManager,
                             JwtService jwtService,
                             UserRepository userRepository,
                             PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- API Đăng ký ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // Kiểm tra email tồn tại chưa
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }

        // Tạo user mới
        User newUser = new User();
        newUser.setName(req.getName());
        newUser.setEmail(req.getEmail());
        newUser.setPassword(passwordEncoder.encode(req.getPassword())); // mã hóa mật khẩu
        newUser.setRole("ROLE_USER");

        userRepository.save(newUser);

        // Tạo token JWT
        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(newUser.getEmail())
                .password(newUser.getPassword())
                .authorities(newUser.getRole())
                .build();

        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    // --- API Đăng nhập ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            // Lấy user từ DB
            User user = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

            // Tạo token JWT
            var userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities(user.getRole())
                    .build();

            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Sai email hoặc mật khẩu");
        }
    }

    // --- Request/Response DTO ---
    @Data
    public static class RegisterRequest {
        private String name;
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private final String accessToken;
    }
}