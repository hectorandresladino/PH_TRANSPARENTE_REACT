package com.phtransparente.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
  "spring.datasource.url=jdbc:h2:mem:context-test;DB_CLOSE_DELAY=-1",
  "spring.datasource.username=sa",
  "spring.datasource.password=",
  "spring.datasource.driver-class-name=org.h2.Driver",
  "spring.jpa.hibernate.ddl-auto=create-drop",
  "app.seed.enabled=true",
  "app.jwt.secret=dGVzdF9qd3Rfc2VjcmV0X2tleV9hdF9sZWFzdF8zMl9ieXRlcw=="
})
class ApplicationContextTest {
  @Test
  void contextLoads() {
  }
}
