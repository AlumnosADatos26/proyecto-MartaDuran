package com.example.apiMoodFilm.repository;

import com.example.apiMoodFilm.model.TokenRecuperacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; 
import org.springframework.transaction.annotation.Transactional; 
import java.util.Optional;

public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Long> {

    Optional<TokenRecuperacion> findByToken(String token);

    @Modifying
    @Transactional
    void deleteByUsuarioId(Long usuarioId);
    
    
}



