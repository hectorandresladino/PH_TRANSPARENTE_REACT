package com.phtransparente.api;

public record DashboardDto(
  int copropiedades,
  int modulos,
  int pqrsAbiertas,
  int reservasHoy,
  int pagosPendientes,
  int alertasSeguridad,
  int usuariosActivos,
  int visitantesHoy,
  int multasPendientes,
  int contratosActivos
) {}
