//package donga.edu.demo.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
//
//// CORS
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import java.util.List;
//
//@Configuration
//public class SecurityConfig {
//
//    private final CustomUserDetailsService userDetailsService;
//    private final JwtAuthFilter jwtAuthFilter;
//    private final JwtAuthenticationEntryPoint authEntryPoint;
//
//    public SecurityConfig(CustomUserDetailsService userDetailsService,
//                          JwtAuthFilter jwtAuthFilter,
//                          JwtAuthenticationEntryPoint authEntryPoint) {
//        this.userDetailsService = userDetailsService;
//        this.jwtAuthFilter = jwtAuthFilter;
//        this.authEntryPoint = authEntryPoint;
//    }
//
//    /* ===== Common beans ===== */
//    @Bean
//    public BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
//
//    @Bean
//    public DaoAuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
//        p.setUserDetailsService(userDetailsService);
//        p.setPasswordEncoder(passwordEncoder());
//        return p;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
//        return cfg.getAuthenticationManager();
//    }
//
//    /* ===== CORS (cho FE Vite 5173) ===== */
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration c = new CorsConfiguration();
//        c.setAllowCredentials(true);
//        c.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174","http://localhost:3000"));
//        c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
//        c.setAllowedHeaders(List.of("*"));
//        c.setExposedHeaders(List.of("Authorization"));
//
//        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
//        s.registerCorsConfiguration("/**", c);
//        return s;
//    }
//
//    /* ===== Chain 1: REST API - JWT, stateless ===== */
//    @Bean
//    @Order(0)
//    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .securityMatcher(new AntPathRequestMatcher("/api/**"))
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> {}) // dùng bean corsConfigurationSource ở trên
//                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
//                .authorizeHttpRequests(auth -> auth
//                        // cho phép preflight
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                        // cho phép login / register
//                        .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
//                        // còn lại phải có token
//                        .anyRequest().authenticated()
//                )
//                .formLogin(form -> form.disable())
//                .httpBasic(basic -> basic.disable())
//                .authenticationProvider(authenticationProvider())
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    /* ===== Chain 2: Web MVC - Form Login (Thymeleaf) ===== */
//    @Bean
//    @Order(1)
//    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .headers(h -> h.frameOptions(f -> f.disable())) // H2 console
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/h2-console/**").permitAll()
//                        .requestMatchers("/login", "/register", "/css/**", "/js/**", "/images/**").permitAll()
//                        .requestMatchers("/companies/new", "/companies/*/edit", "/companies/*/delete").hasRole("ADMIN")
//                        .requestMatchers("/users/new", "/users/*/edit", "/users/*/delete").hasRole("ADMIN")
//                        .requestMatchers("/companies", "/companies/*").hasAnyRole("ADMIN", "USER")
//                        .requestMatchers("/users", "/users/*").hasAnyRole("ADMIN", "USER")
//                        .anyRequest().authenticated()
//                )
//                .formLogin(form -> form
//                        .loginPage("/login")
//                        .defaultSuccessUrl("/users", true)
//                        .permitAll()
//                )
//                .logout(logout -> logout
//                        .logoutUrl("/logout")
//                        .logoutSuccessUrl("/login?logout")
//                        .permitAll()
//                )
//                .authenticationProvider(authenticationProvider());
//
//        return http.build();
//    }
//}

package donga.edu.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint authEntryPoint;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JwtAuthFilter jwtAuthFilter,
                          JwtAuthenticationEntryPoint authEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
        this.authEntryPoint = authEntryPoint;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    /* ===== CORS ===== */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowCredentials(true);
        c.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        c.setAllowedHeaders(List.of("*"));
        c.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }

    /* ===== API Security (JWT) ===== */
    @Bean
    @Order(0)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher(new AntPathRequestMatcher("/api/**"))
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /* ===== Web MVC (Form login) ===== */
    @Bean
    @Order(1)
    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .headers(h -> h.frameOptions(f -> f.disable())) // cho H2 console
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/login", "/register", "/css/**", "/js/**", "/images/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/users", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )
                .authenticationProvider(authenticationProvider());

        return http.build();
    }
}

