package donga.edu.demo.controllers.api;

import donga.edu.demo.models.User;
import donga.edu.demo.repository.UserRepository;
import donga.edu.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"}, allowCredentials = "true")
public class UserApiController {

    private final UserService userService;       // dùng service để ENCODE password
    private final UserRepository userRepository; // cho endpoint /me

    // FE gọi sau khi login để lấy user hiện tại
    @GetMapping("/me")
    public User me(Authentication authentication) {
        String email = authentication.getName();           // login bằng email
        return userRepository.findByEmail(email).orElseThrow();
    }

    // List (Page)
    @GetMapping
    public Page<User> list(@RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "20") int size) {
        return userService.list(PageRequest.of(page, size));
    }

    // Get one
    @GetMapping("/{id}")
    public User get(@PathVariable Long id) {
        return userService.getById(id);
    }

    // Create (ADMIN) – service sẽ encode password nếu có
    @PostMapping
    public User create(@RequestBody User req) {
        return userService.create(req);
    }

    // Update (ADMIN) – service chỉ encode khi có password mới
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User req) {
        return userService.update(id, req);
    }

    // Delete (ADMIN)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
