package com.phtransparente.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

@Service
public class SmsService {
  private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

  @Value("${callmebot.api.key}")
  private String apiKey;

  @Value("${callmebot.phone.number}")
  private String senderPhoneNumber;

  public void sendVerificationCode(String phoneNumber, String message) {
    String formattedPhone = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedPhone = "+57" + phoneNumber;
    }

    try {
      String apiUrl = String.format(
          "https://api.callmebot.com/whatsapp.php?phone=%s&text=%s&apikey=%s",
          formattedPhone,
          URLEncoder.encode(message, "UTF-8"),
          apiKey != null ? apiKey : ""
      );

      URL url = new URL(apiUrl);
      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setRequestMethod("GET");
      connection.setConnectTimeout(10000);
      connection.setReadTimeout(10000);

      int responseCode = connection.getResponseCode();
      BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
      StringBuilder response = new StringBuilder();
      String line;
      while ((line = reader.readLine()) != null) {
        response.append(line);
      }
      reader.close();

      if (responseCode == 200) {
        logger.info("WhatsApp enviado exitosamente a: {}", formattedPhone);
      } else {
        logger.warn("Error al enviar WhatsApp. Codigo: {}, Respuesta: {}", responseCode, response.toString());
        logger.info("========================================");
        logger.info("Mensaje: {}", message);
        logger.info("Para celular: {}", formattedPhone);
        logger.info("========================================");
      }
    } catch (Exception e) {
      logger.error("Error al enviar WhatsApp: {}", e.getMessage());
      logger.info("========================================");
      logger.info("Mensaje: {}", message);
      logger.info("Para celular: {}", formattedPhone);
      logger.info("========================================");
    }
  }
}
