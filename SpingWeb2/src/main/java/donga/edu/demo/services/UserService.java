package donga.edu.demo.services;

import donga.edu.demo.models.User;
import donga.edu.demo.models.Company;
import donga.edu.demo.repository.UserRepository;
import donga.edu.demo.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    // Create
    public User create(User user) {
        if (user.getCompany() != null && user.getCompany().getId() != null) {
            Company c = companyRepository.findById(user.getCompany().getId()).orElseThrow();
            user.setCompany(c);
        } else {
            user.setCompany(null);
        }

        // ✅ luôn bật enable để user đăng nhập được
        user.setEnabled(true);

        // ✅ nếu chưa có role thì mặc định USER
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        }

        // ✅ luôn encode password khi tạo
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    // List
    public Page<User> list(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    // Get one
    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    // Get by email
    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Update
    public User update(Long id, User userData) {
        User u = getById(id);

        if (userData.getName() != null) u.setName(userData.getName());
        if (userData.getEmail() != null) u.setEmail(userData.getEmail());
        if (userData.getRole() != null) u.setRole(userData.getRole());

        if (userData.getPassword() != null && !userData.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(userData.getPassword()));
        }

        if (userData.getCompany() != null && userData.getCompany().getId() != null) {
            Company c = companyRepository.findById(userData.getCompany().getId()).orElseThrow();
            u.setCompany(c);
        }

        // ✅ đảm bảo luôn enable
        u.setEnabled(true);

        return userRepository.save(u);
    }

    // Delete
    public void delete(Long id) {
        User u = getById(id);
        userRepository.delete(u);
    }
}
