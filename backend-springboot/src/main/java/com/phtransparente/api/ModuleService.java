package com.phtransparente.api;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ModuleService {
  public List<ModuleDto> findAll() {
    return MODULES;
  }

  public ModuleDto findById(Integer id) {
    return MODULES.stream()
      .filter(m -> m.id().equals(id))
      .findFirst()
      .orElseThrow(() -> new IllegalArgumentException("Módulo no encontrado: " + id));
  }

  public DashboardDto getDashboardStats() {
    return new DashboardDto(
      1, // copropiedades
      24, // modulos
      5, // pqrsAbiertas
      3, // reservasHoy
      12, // pagosPendientes
      2, // alertasSeguridad
      45, // usuariosActivos
      8, // visitantesHoy
      15, // multasPendientes
      3 // contratosActivos
    );
  }

  private static final List<ModuleDto> MODULES = List.of(
    new ModuleDto(1, "Copropiedad y configuración general", "Administración", "Configuración base de la copropiedad, reglamento, datos generales y parámetros."),
    new ModuleDto(2, "Unidades privadas, torres, coeficientes y bienes", "Administración", "Apartamentos, casas, locales, depósitos, parqueaderos y coeficientes."),
    new ModuleDto(3, "Propietarios, residentes y arrendatarios", "Comunidad", "Personas vinculadas a cada unidad, vehículos, mascotas y contactos."),
    new ModuleDto(4, "Usuarios, roles y permisos", "Seguridad", "Control de acceso por rol y permisos."),
    new ModuleDto(5, "Recibos mensuales y facturación", "Financiero", "Recibos de administración, parqueaderos, zonas comunes, multas e intereses."),
    new ModuleDto(6, "Pagos, recaudos y comprobantes", "Financiero", "Pagos, soportes, confirmaciones, conciliación e historial."),
    new ModuleDto(7, "Cartera, mora y acuerdos de pago", "Financiero", "Saldos pendientes, mora, intereses y acuerdos de pago."),
    new ModuleDto(8, "Parqueaderos comunales", "Operación", "Solicitud, asignación, placas, lista de espera, cobro y vencimientos."),
    new ModuleDto(9, "Zonas comunes, BBQ, piscina y reservas", "Operación", "Reservas, aforo, horarios, cobros, depósitos y reglas."),
    new ModuleDto(10, "Portería, vigilancia, puntos fijos, ronderos, hallazgos y seguridad", "Seguridad", "Visitantes, rondas, hallazgos, minuta, placas y alertas."),
    new ModuleDto(11, "Convivencia, infracciones, multas y autoridades", "Convivencia", "Reportes, debido proceso, sanciones, descargos y escalamiento a autoridad."),
    new ModuleDto(12, "PQRS, derechos de petición, escucha e irregularidades", "Comunidad", "Radicación formal, términos, respuestas, canal de escucha y reportes sensibles."),
    new ModuleDto(13, "Comunicados, notas, edictos y notificaciones", "Comunidad", "Avisos oficiales, correos, push, edictos y acuse de lectura."),
    new ModuleDto(14, "Documentos, actas y archivo digital", "Documental", "Reglamentos, actas, contratos, soportes, certificados y políticas."),
    new ModuleDto(15, "Consejo de Administración", "Gobierno", "Tablero del consejo, seguimiento, control e informes."),
    new ModuleDto(16, "Decisiones y votaciones del Consejo", "Gobierno", "Votación interna, observaciones, resultados y actas de consejo."),
    new ModuleDto(17, "Asamblea General", "Gobierno", "Convocatorias, poderes, asistencia, orden del día y actas."),
    new ModuleDto(18, "Votaciones, quórum y publicación de resultados", "Gobierno", "Votos, coeficientes, quórum, resultados y publicación oficial."),
    new ModuleDto(19, "Licitaciones, proveedores y beneficios", "Contratación", "Convocatorias, propuestas, descuentos, bonificaciones y comparativos."),
    new ModuleDto(20, "Contratos y seguimiento de proveedores", "Contratación", "Contratos, pólizas, vencimientos, pagos, cumplimiento y renovaciones."),
    new ModuleDto(21, "Proyectos, obras y mejoras de la copropiedad", "Proyectos", "Presupuesto, cronograma, avance físico/financiero, evidencias y garantías."),
    new ModuleDto(22, "Reportes e informes administrativos", "Reportes", "Informes de gestión, cartera, pagos, reservas, PQRS, proyectos y contratos."),
    new ModuleDto(23, "Auditoría, trazabilidad y seguridad de la información", "Seguridad", "Registro de acciones, cambios, accesos, IP, usuario, fecha y evidencia."),
    new ModuleDto(24, "Cartelera digital, transparencia y seguimiento general", "Transparencia", "Estado de proyectos, decisiones, informes, contratos y avances autorizados.")
  );
}
