FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

# OpenShift ejecuta los contenedores con un UID arbitrario perteneciente al
# grupo 0. La imagen no necesita privilegios y solo requiere lectura en /app.
RUN chgrp -R 0 /app && chmod -R g=u /app

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.io.tmpdir=/tmp"

USER 1001
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
