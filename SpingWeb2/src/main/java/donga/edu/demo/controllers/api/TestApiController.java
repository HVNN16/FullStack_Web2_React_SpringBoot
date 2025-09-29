package donga.edu.demo.controllers.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestApiController {

    @GetMapping("/api/hello")
    public String helloApi() {
        return "API is working!";
    }
}
