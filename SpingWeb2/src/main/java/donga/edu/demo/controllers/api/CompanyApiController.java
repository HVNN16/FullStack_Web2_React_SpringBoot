package donga.edu.demo.controllers.api;

import donga.edu.demo.models.Company;
import donga.edu.demo.services.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyApiController {

    private final CompanyService companyService;

    // Create
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Company create(@Valid @RequestBody Company company) {
        return companyService.create(company);
    }

    // List all
    @GetMapping
    public Page<Company> list(Pageable pageable) {
        return companyService.list(pageable);
    }

    // Get one
    @GetMapping("/{id}")
    public Company get(@PathVariable Long id) {
        return companyService.getById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Company update(@PathVariable Long id,
                          @Valid @RequestBody Company company) {
        return companyService.update(id, company);
    }

    // Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        companyService.delete(id);
    }
}
