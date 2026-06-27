package com.phtransparente.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

  @Autowired(required = false)
  private JavaMailSender mailSender;

  @Value("${app.email.from:phtransparente@gmail.com}")
  private String fromEmail;

  public void sendEmail(String to, String subject, String body) {
    if (mailSender == null) {
      logger.warn("JavaMailSender no configurado. No se puede enviar correo.");
      logger.info("========================================");
      logger.info("Destinatario: {}", to);
      logger.info("Asunto: {}", subject);
      logger.info("Mensaje: {}", body);
      logger.info("========================================");
      return;
    }
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(to);
      message.setSubject(subject);
      message.setText(body);

      mailSender.send(message);
      logger.info("Correo enviado exitosamente a: {}", to);
    } catch (Exception e) {
      logger.error("Error al enviar correo a {}: {}", to, e.getMessage());
      logger.info("========================================");
      logger.info("Destinatario: {}", to);
      logger.info("Asunto: {}", subject);
      logger.info("Mensaje: {}", body);
      logger.info("========================================");
    }
  }

  public void sendVerificationCode(String email, String code) {
    String subject = "Codigo de verificacion - PH Transparente";
    String body = "Tu codigo de verificacion de PH Transparente es: " + code + "\n\n" +
        "Este codigo expira en 15 minutos.\n\n" +
        "Si no fuiste tu quien intento ingresar, contacta al administrador inmediatamente.\n\n" +
        "Saludos,\nEquipo PH Transparente";
    sendEmail(email, subject, body);
  }

  public void sendPassword(String email, String password) {
    String subject = "Tu contrasena de acceso - PH Transparente";
    String body = "Hola,\n\n" +
        "Tu contrasena de acceso a PH Transparente es: " + password + "\n\n" +
        "Usa esta contrasena junto con tu usuario para ingresar al sistema.\n\n" +
        "Si no solicitaste esta contrasena, contacta al administrador inmediatamente.\n\n" +
        "Saludos,\nEquipo PH Transparente";
    sendEmail(email, subject, body);
  }

  public void sendLoginAlert(String email, String username) {
    String subject = "Inicio de sesion detectado - PH Transparente";
    String body = "Hola,\n\n" +
        "Se ha iniciado sesion en tu cuenta de PH Transparente con el usuario: " + username + "\n" +
        "Fecha y hora: " + java.time.LocalDateTime.now() + "\n\n" +
        "Si fuiste tu, puedes ignorar este mensaje.\n" +
        "Si NO fuiste tu, contacta al administrador inmediatamente para proteger tu cuenta.\n\n" +
        "Saludos,\nEquipo PH Transparente";
    sendEmail(email, subject, body);
  }
}
