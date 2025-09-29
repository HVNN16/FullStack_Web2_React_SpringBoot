package donga.edu.demo.controllers;

import donga.edu.demo.models.User;
import donga.edu.demo.repository.UserRepository;
import donga.edu.demo.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Form tạo user mới
    @GetMapping("/users/new")
    public String showCreateForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("companies", companyRepository.findAll());
        return "user/create-user";
    }

    // Lưu user mới
    @PostMapping("/users")
    public String saveUser(@ModelAttribute User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true); // bật enable để đăng nhập được
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER"); // mặc định USER nếu chưa chọn
        }
        userRepository.save(user);
        return "redirect:/users";
    }

    // Danh sách user
    @GetMapping("/users")
    public String listUsers(Model model) {
        model.addAttribute("users", userRepository.findAll());
        return "user/list-users";
    }

    // Chi tiết user
    @GetMapping("/users/{id}")
    public String showUserDetail(@PathVariable Long id, Model model) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return "redirect:/users";
        model.addAttribute("user", user);
        return "user/user-detail";
    }

    // Form edit user
    @GetMapping("/users/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return "redirect:/users";
        model.addAttribute("user", user);
        model.addAttribute("companies", companyRepository.findAll());
        return "user/edit-user";
    }

    // Update user
    @PostMapping("/users/{id}/update")
    public String updateUser(@PathVariable Long id, @ModelAttribute User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) return "redirect:/users";

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        existingUser.setRole(user.getRole());
        existingUser.setCompany(user.getCompany());
        existingUser.setEnabled(true); // luôn bật enable

        userRepository.save(existingUser);
        return "redirect:/users";
    }

    // Xóa user
    @GetMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "redirect:/users";
    }
}
