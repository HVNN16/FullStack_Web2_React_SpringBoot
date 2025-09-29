package donga.edu.demo.security;

import donga.edu.demo.models.User;
import donga.edu.demo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(user.getRole()))
        );
    }

    @Service
    public static class JwtService {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.expiration}")
        private long expirationMs;

        private Key getSigningKey() {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        }

        public String extractUsername(String token) {
            return extractClaim(token, Claims::getSubject);
        }

        public <T> T extractClaim(String token, Function<Claims, T> resolver) {
            final Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return resolver.apply(claims);
        }

        public String generateToken(UserDetails user) {
            return generateToken(Map.of("roles", user.getAuthorities()), user);
        }

        public String generateToken(Map<String, Object> extraClaims, UserDetails user) {
            Date now = new Date();
            Date exp = new Date(now.getTime() + expirationMs);
            return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(user.getUsername())
                    .setIssuedAt(now)
                    .setExpiration(exp)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        }

        public boolean isTokenValid(String token, UserDetails user) {
            final String username = extractUsername(token);
            return username.equals(user.getUsername()) && !isExpired(token);
        }

        private boolean isExpired(String token) {
            return extractClaim(token, Claims::getExpiration).before(new Date());
        }
    }
}
