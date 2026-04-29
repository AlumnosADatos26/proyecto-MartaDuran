
package com.example.apiMoodFilm.dto;

public class GoogleAuthRequest {
    private String token; //el token que manda el frontend

    public GoogleAuthRequest() {}

    public String getToken() { 
        return token; 
    }
    
    public void setToken(String token) {
        this.token = token; 
    }
}
