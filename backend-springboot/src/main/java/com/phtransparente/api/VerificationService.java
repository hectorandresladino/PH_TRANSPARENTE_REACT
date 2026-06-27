package com.phtransparente.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VerificationService {
  private static final Logger logger = LoggerFactory.getLogger(VerificationService.class);
  private final VerificationCodeRepository verificationCodeRepository;
  private final UserRepository userRepository;
  private final SmsService smsService;

  public VerificationService(VerificationCodeRepository verificationCodeRepository, UserRepository userRepository, SmsService smsService) {
    this.verificationCodeRepository = verificationCodeRepository;
    this.userRepository = userRepository;
    this.smsService = smsService;
  }

  // Generar código de 6 dígitos
  public String generateCode() {
    Random random = new Random();
    return String.format("%06d", random.nextInt(1000000));
  }

  // Crear y enviar código de verificación
  public String createAndSendVerificationCode(String username) {
    User user = userRepository.findByUsername(username);
    if (user == null) {
      throw new IllegalArgumentException("Usuario no encontrado");
    }

    if (user.getPhone() == null || user.getPhone().isEmpty()) {
      throw new IllegalArgumentException("El usuario no tiene número de celular configurado");
    }

    // Eliminar códigos anteriores no usados
    verificationCodeRepository.deleteByUsername(username);

    // Generar nuevo código
    String code = generateCode();
    LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15); // Expira en 15 minutos

    VerificationCode verificationCode = new VerificationCode(username, code, expiresAt);
    verificationCodeRepository.save(verificationCode);

    // Enviar código por SMS
    smsService.sendVerificationCode(user.getPhone(), code);

    return code;
  }

  // Verificar código
  public boolean verifyCode(String username, String code) {
    VerificationCode verificationCode = verificationCodeRepository.findByCode(code).orElse(null);

    if (verificationCode == null) {
      logger.warn("Código no encontrado: {}", code);
      return false;
    }

    if (!verificationCode.getUsername().equals(username)) {
      logger.warn("Código no pertenece al usuario: {}", username);
      return false;
    }

    if (verificationCode.isExpired()) {
      logger.warn("Código expirado para usuario: {}", username);
      return false;
    }

    if (verificationCode.getUsed()) {
      logger.warn("Código ya usado para usuario: {}", username);
      return false;
    }

    // Marcar como usado
    verificationCode.setUsed(true);
    verificationCodeRepository.save(verificationCode);

    logger.info("Código verificado exitosamente para usuario: {}", username);
    return true;
  }

  // Verificar si el usuario tiene un código válido pendiente
  public boolean hasPendingCode(String username) {
    return verificationCodeRepository.findByUsernameAndUsedFalse(username).isPresent();
  }
}
