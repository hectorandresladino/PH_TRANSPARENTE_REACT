package com.phtransparente.api;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
  private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

  @Value("${twilio.account.sid}")
  private String accountSid;

  @Value("${twilio.auth.token}")
  private String authToken;

  @Value("${twilio.phone.number}")
  private String twilioPhoneNumber;

  public void sendVerificationCode(String phoneNumber, String code) {
    if (accountSid == null || accountSid.isEmpty() || 
        authToken == null || authToken.isEmpty() || 
        twilioPhoneNumber == null || twilioPhoneNumber.isEmpty()) {
      logger.warn("Twilio no está configurado. Mostrando código en consola: {}", code);
      logger.info("========================================");
      logger.info("CÓDIGO DE VERIFICACIÓN: {}", code);
      logger.info("Para celular: {}", phoneNumber);
      logger.info("========================================");
      return;
    }

    try {
      Twilio.init(accountSid, authToken);

      // Formatear el número de teléfono (agregar +57 si no tiene código de país)
      String formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith("+")) {
        formattedPhone = "+57" + phoneNumber;
      }

      Message message = Message.creator(
          new PhoneNumber(formattedPhone),
          new PhoneNumber(twilioPhoneNumber),
          "Tu código de verificación de PH Transparente es: " + code + ". Expira en 15 minutos."
      ).create();

      logger.info("SMS enviado exitosamente. SID: {}", message.getSid());
    } catch (Exception e) {
      logger.error("Error al enviar SMS: {}", e.getMessage());
      logger.info("========================================");
      logger.info("CÓDIGO DE VERIFICACIÓN: {}", code);
      logger.info("Para celular: {}", phoneNumber);
      logger.info("========================================");
    }
  }
}
