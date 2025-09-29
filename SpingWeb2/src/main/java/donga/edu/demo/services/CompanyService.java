package donga.edu.demo.services;

import donga.edu.demo.models.Company;
import donga.edu.demo.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;


    public Company create(Company company) {
        return companyRepository.save(company);
    }


    public Page<Company> list(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }

    public Company getById(Long id) {
        return companyRepository.findById(id).orElseThrow();
    }

    public Company update(Long id, Company companyData) {
        Company company = getById(id);
        company.setName(companyData.getName());
        company.setAddress(companyData.getAddress());
        return companyRepository.save(company);
    }


    public void delete(Long id) {

        Company company = getById(id);
        companyRepository.delete(company);
    }
}