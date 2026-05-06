package com.example.apiMoodFilm.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmailRecuperacion(String destinatario, String token) {
        String link = "http://localhost:8100/reset-password?token=" + token;

        MimeMessage mensaje = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("Recupera tu contraseña - MoodFilm");

            //el btn del emain con html
            String contenidoHtml
                    = "<div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>"
                    + "<h2>Hola,</h2>"
                    + "<p>Recibimos una solicitud para restablecer tu contraseña en <strong>MoodFilm</strong>.</p>"
                    + "<p>Haz clic en el botón de abajo para continuar (válido por 15 min):</p>"
                    + "<br>"
                    + "<a href='" + link + "' style='"
                    + "background-color: #6200ee;"
                    + 
                    "color: white;"
                    + "padding: 12px 25px;"
                    + "text-decoration: none;"
                    + "border-radius: 5px;"
                    + "display: inline-block;"
                    + "font-weight: bold;'> "
                    + "Restablecer Contraseña"
                    + "</a>"
                    + "<br><br>"
                    + "<p style='color: #777; font-size: 12px;'>Si no solicitaste esto, puedes ignorar este correo.</p>"
                    + "<hr style='border: 0; border-top: 1px solid #eee;'>"
                    + "<p style='font-size: 11px; color: #aaa;'>— El equipo de MoodFilm</p>"
                    + "</div>";

            helper.setText(contenidoHtml, true); // El true indica que es html
            mailSender.send(mensaje);

        } 
        catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el email: " + e.getMessage());
        }
    }
}
