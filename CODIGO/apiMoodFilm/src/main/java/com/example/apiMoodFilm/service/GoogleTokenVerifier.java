package com.example.apiMoodFilm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GoogleTokenVerifier {

    @Value("${google.client-id}")
    private String clientId;

    public GoogleUserInfo verify(String idToken) {
        try {
            //llamamos a la API de google para validar el token
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Token de Google rechazado por Google");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response.body());

            //verificamos que el token es para la app
            String aud = node.get("aud").asText();
            if (!aud.equals(clientId)) {
                throw new RuntimeException("El token no pertenece a esta aplicación");
            }

            // y extraemos los datos
            String email = node.get("email").asText();
            String name = node.has("name") ? node.get("name").asText() : email.split("@")[0];
            String picture = node.has("picture") ? node.get("picture").asText() : null;

            return new GoogleUserInfo(email, name, picture);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar token de Google", e);
        }
    }

    public static class GoogleUserInfo {
        public final String email;
        public final String name;
        public final String picture;

        public GoogleUserInfo(String email, String name, String picture) {
            this.email = email;
            this.name = name;
            this.picture = picture;
        }
    }
}