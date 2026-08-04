package com.phtransparente.api;

import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.Mockito.*;

public class EmailServiceTest {

  @Test
  public void sendVerificationCode_sendsEmail() {
    EmailService emailService = new EmailService();
    JavaMailSender mailSender = mock(JavaMailSender.class);
    ReflectionTestUtils.setField(emailService, "mailSender", mailSender);
    ReflectionTestUtils.setField(emailService, "fromEmail", "phtransparente@gmail.com");

    emailService.sendVerificationCode("test@phtransparente.com", "123456");

    verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
  }

  @Test
  public void sendEmail_withoutMailSender_doesNotThrow() {
    EmailService emailService = new EmailService();
    ReflectionTestUtils.setField(emailService, "fromEmail", "phtransparente@gmail.com");

    emailService.sendEmail("test@phtransparente.com", "Asunto", "Mensaje");
  }
}
