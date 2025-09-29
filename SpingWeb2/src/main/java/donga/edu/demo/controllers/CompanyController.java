package donga.edu.demo.controllers;

import donga.edu.demo.models.Company;
import donga.edu.demo.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    // Danh sách công ty (Admin và User đều xem được)
    @GetMapping
    public String listCompanies(Model model) {
        model.addAttribute("companies", companyRepository.findAll());
        return "company/list";
    }

    // Form tạo mới (Chỉ Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("company", new Company());
        return "company/create";
    }

    // Lưu công ty mới (Chỉ Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public String saveCompany(@ModelAttribute Company company) {
        companyRepository.save(company);
        return "redirect:/companies";
    }

    // Form sửa (Chỉ Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isPresent()) {
            model.addAttribute("company", company.get());
            return "company/edit";
        }
        return "redirect:/companies";
    }

    // Cập nhật công ty (Chỉ Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/update")
    public String updateCompany(@PathVariable Long id, @ModelAttribute Company company) {
        company.setId(id);
        companyRepository.save(company);
        return "redirect:/companies";
    }

    // Xóa công ty (Chỉ Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/delete")
    public String deleteCompany(@PathVariable Long id) {
        companyRepository.deleteById(id);
        return "redirect:/companies";
    }

    // Chi tiết công ty (Admin và User đều xem được)
    @GetMapping("/{id}")
    public String showCompanyDetail(@PathVariable Long id, Model model) {
        Company company = companyRepository.findById(id).orElse(null);
        if (company == null) return "redirect:/companies";
        model.addAttribute("company", company);
        return "company/detail";
    }
}
