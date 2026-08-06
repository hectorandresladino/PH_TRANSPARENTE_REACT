package com.phtransparente.api;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

  private final PqrRepository pqrRepository;
  private final AnnualBudgetRepository annualBudgetRepository;
  private final BudgetItemRepository budgetItemRepository;
  private final BudgetInquiryRepository budgetInquiryRepository;
  private final BudgetProposalRepository budgetProposalRepository;

  public AiAssistantService(PqrRepository pqrRepository,
                            AnnualBudgetRepository annualBudgetRepository,
                            BudgetItemRepository budgetItemRepository,
                            BudgetInquiryRepository budgetInquiryRepository,
                            BudgetProposalRepository budgetProposalRepository) {
    this.pqrRepository = pqrRepository;
    this.annualBudgetRepository = annualBudgetRepository;
    this.budgetItemRepository = budgetItemRepository;
    this.budgetInquiryRepository = budgetInquiryRepository;
    this.budgetProposalRepository = budgetProposalRepository;
  }

  // =================== PQR AI SUGGESTION ===================

  public Map<String, Object> suggestPqrResponse(Long pqrId) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<Pqr> opt = pqrRepository.findById(pqrId);
    if (opt.isEmpty() || !orgId.equals(opt.get().getOrganizationId())) {
      return Map.of("error", "PQR no encontrado");
    }
    Pqr pqr = opt.get();

    String type = pqr.getType() != null ? pqr.getType().toUpperCase() : "PETICION";
    String priority = pqr.getPriority() != null ? pqr.getPriority().toUpperCase() : "MEDIA";
    String title = pqr.getTitle() != null ? pqr.getTitle() : "";
    String description = pqr.getDescription() != null ? pqr.getDescription() : "";
    String requester = pqr.getRequester() != null ? pqr.getRequester() : "Residente";

    // Analizar urgencia
    String urgency = analyzeUrgency(priority, type, description);
    // Detectar categoria tematica
    String category = detectPqrCategory(title, description);
    // Generar respuesta sugerida
    String suggestedResponse = generatePqrResponse(type, priority, category, requester, title, description);
    // Generar acciones recomendadas
    List<String> actions = recommendPqrActions(type, priority, category);
    // Calcular tiempo de respuesta estimado
    String estimatedTime = estimateResponseTime(priority, type);
    // Detectar si requiere escalamiento
    boolean requiresEscalation = requiresEscalation(priority, type, description);
    // Calcular sentimiento
    String sentiment = analyzeSentiment(description);

    Map<String, Object> result = new LinkedHashMap<>();
    result.put("suggestedResponse", suggestedResponse);
    result.put("category", category);
    result.put("urgency", urgency);
    result.put("sentiment", sentiment);
    result.put("estimatedResponseTime", estimatedTime);
    result.put("requiresEscalation", requiresEscalation);
    result.put("recommendedActions", actions);
    result.put("suggestedStatus", type.equals("QUEJA") && priority.equals("ALTA") ? "EN_REVISION" : "EN_PROCESO");
    result.put("suggestedPriority", adjustPriority(priority, category, description));

    return result;
  }

  private String analyzeUrgency(String priority, String type, String description) {
    if (priority.equals("ALTA")) return "CRITICA";
    if (type.equals("QUEJA") || type.equals("RECLAMO")) return "ALTA";
    if (description != null) {
      String lower = description.toLowerCase();
      if (lower.contains("urgente") || lower.contains("emergencia") || lower.contains("inmediato") || lower.contains("peligro")) {
        return "CRITICA";
      }
      if (lower.contains("rapido") || lower.contains("pronto") || lower.contains("cuanto tiempo")) {
        return "ALTA";
      }
    }
    if (priority.equals("MEDIA")) return "MEDIA";
    return "BAJA";
  }

  private String detectPqrCategory(String title, String description) {
    String combined = (title + " " + description).toLowerCase();
    if (combined.contains("agua") || combined.contains("tuberia") || combined.contains("goteras") || combined.contains("humedad")) return "INFRAESTRUCTURA";
    if (combined.contains("pago") || combined.contains("factura") || combined.contains("recibo") || combined.contains("administracion") || combined.contains("cuota")) return "FINANCIERO";
    if (combined.contains("ruido") || combined.contains("mascota") || combined.contains("vecino") || combined.contains("convivencia") || combined.contains("invasion")) return "CONVIVENCIA";
    if (combined.contains("seguridad") || combined.contains("robo") || combined.contains("hurto") || combined.contains("sospechoso") || combined.contains("porteria") || combined.contains("vigilancia")) return "SEGURIDAD";
    if (combined.contains("parqueadero") || combined.contains("parqueo") || combined.contains("vehiculo") || combined.contains("carro") || combined.contains("moto")) return "PARQUEADERO";
    if (combined.contains("zona comun") || combined.contains("piscina") || combined.contains("gimnasio") || combined.contains("bbq") || combined.contains("salon") || combined.contains("reserva")) return "ZONAS_COMUNES";
    if (combined.contains("ascensor") || combined.contains("elevador")) return "ASCENSOR";
    if (combined.contains("limpieza") || combined.contains("aseo") || combined.contains("basura") || combined.contains("residuos")) return "LIMPIEZA";
    if (combined.contains("obra") || combined.contains("remodelacion") || combined.contains("construccion") || combined.contains("reparacion")) return "OBRAS";
    if (combined.contains("documento") || combined.contains("certificado") || combined.contains("paz y salvo") || combined.contains("carta")) return "DOCUMENTOS";
    if (combined.contains("junta") || combined.contains("asamblea") || combined.contains("consejo") || combined.contains("votacion")) return "GOBIERNO";
    return "GENERAL";
  }

  private String generatePqrResponse(String type, String priority, String category, String requester, String title, String description) {
    StringBuilder sb = new StringBuilder();
    sb.append("Estimado/a ").append(requester).append(",\n\n");
    sb.append("Hemos recibido su ").append(type.toLowerCase()).append(" titulada \"").append(title).append("\" ");
    sb.append("y queremos informarle que ha sido registrada en nuestro sistema con la debida trazabilidad.\n\n");

    // Respuesta segun categoria
    switch (category) {
      case "INFRAESTRUCTURA":
        sb.append("Su solicitud relacionada con infraestructura ha sido asignada al area de mantenimiento. ");
        sb.append("Se realizara una inspeccion tecnica para evaluar la situacion y determinar las acciones correctivas necesarias. ");
        sb.append("Le mantendremos informado sobre los avances y plazos estimados.\n\n");
        break;
      case "FINANCIERO":
        sb.append("Su solicitud de caracter financiero ha sido derivada al area de contabilidad. ");
        sb.append("Se revisara su caso detalladamente y se verificaran los registros correspondientes. ");
        sb.append("Si requiere soporte adicional, le agradecemos adjuntar los documentos pertinentes.\n\n");
        break;
      case "CONVIVENCIA":
        sb.append("Su reporte de convivencia sera tratado conforme al reglamento de propiedad horizontal (Ley 675 de 2001). ");
        sb.append("El Comite de Convivencia evaluara el caso y, si es necesario, se citaran las partes a un espacio de conciliacion. ");
        sb.append("Le recordamos que todo proceso garantiza el derecho al debido proceso.\n\n");
        break;
      case "SEGURIDAD":
        sb.append("Su reporte de seguridad ha sido marcado como prioridad y comunicado al equipo de vigilancia. ");
        sb.append("Se han tomado las medidas inmediatas para verificar la situacion. ");
        sb.append("Si se trata de un evento en curso, le recomendamos contactar directamente a portería.\n\n");
        break;
      case "PARQUEADERO":
        sb.append("Su solicitud sobre parqueadero sera revisada por la administracion. ");
        sb.append("Se verificaran los registros de asignacion y las normas del reglamento correspondientes. ");
        sb.append("Le contactaremos con la respuesta formal en el menor tiempo posible.\n\n");
        break;
      case "ZONAS_COMUNES":
        sb.append("Su solicitud sobre zonas comunes sera coordinada con el area de administracion. ");
        sb.append("Se verificaran las reservas, disponibilidad y normas de uso aplicables. ");
        sb.append("Le confirmaremos la informacion solicitada a la brevedad.\n\n");
        break;
      case "ASCENSOR":
        sb.append("Su reporte sobre el ascensor ha sido escalado al proveedor de mantenimiento. ");
        sb.append("La atencion de ascensores se trata como emergencia por seguridad de los residentes. ");
        sb.append("Se realizara visita tecnica en el menor tiempo posible.\n\n");
        break;
      case "LIMPIEZA":
        sb.append("Su solicitud sobre limpieza ha sido comunicada al personal de aseo. ");
        sb.append("Se reforzara la frecuencia o se atendera el punto especifico reportado. ");
        sb.append("Agradecemos su colaboracion en el mantenimiento de las areas comunes.\n\n");
        break;
      case "OBRAS":
        sb.append("Su solicitud relacionada con obras sera evaluada por el area de proyectos. ");
        sb.append("Se verificara si cuenta con la aprobacion correspondiente y se programara una visita de inspeccion. ");
        sb.append("Le informaremos los requisitos y plazos aplicables.\n\n");
        break;
      case "DOCUMENTOS":
        sb.append("Su solicitud documental sera procesada por la administracion. ");
        sb.append("El tiempo maximo de respuesta conforme a la ley es de 15 dias habiles. ");
        sb.append("Le contactaremos cuando el documento este listo para entrega.\n\n");
        break;
      case "GOBIERNO":
        sb.append("Su solicitud relacionada con organos de gobierno sera atendida por la administracion ");
        sb.append("y, si corresponde, sera incluida en la proxima agenda del Consejo de Administracion o Asamblea. ");
        sb.append("Le mantendremos informado sobre las decisiones tomadas.\n\n");
        break;
      default:
        sb.append("Su solicitud sera atendida por el area correspondiente. ");
        sb.append("Se realizara el analisis del caso y se le brindara una respuesta formal dentro de los terminos legales. ");
        sb.append("Agradecemos su paciencia y colaboracion.\n\n");
        break;
    }

    // Cierre segun prioridad
    if (priority.equals("ALTA")) {
      sb.append("Dada la prioridad alta de su solicitud, nos comprometemos a darle una respuesta preliminar dentro de las 48 horas siguientes. ");
    } else {
      sb.append("Le brindaremos una respuesta formal dentro del termino legal establecido (15 dias habiles). ");
    }

    sb.append("\n\nCordialmente,\nAdministracion de la Copropiedad");

    return sb.toString();
  }

  private List<String> recommendPqrActions(String type, String priority, String category) {
    List<String> actions = new ArrayList<>();
    actions.add("Registrar la PQR en el libro de actas y asignar numero de radicacion");

    switch (category) {
      case "INFRAESTRUCTURA":
        actions.add("Programar visita de inspeccion tecnica");
        actions.add("Verificar si existe garantia o contrato de mantenimiento aplicable");
        break;
      case "FINANCIERO":
        actions.add("Revisar historial de pagos y estado de cuenta del residente");
        actions.add("Verificar facturacion y conceptos cobrados");
        break;
      case "CONVIVENCIA":
        actions.add("Documentar los hechos con testigos si los hay");
        actions.add("Remitir al Comite de Convivencia si procede");
        actions.add("Verificar articulos del reglamento interno aplicables");
        break;
      case "SEGURIDAD":
        actions.add("Notificar inmediatamente al jefe de seguridad");
        actions.add("Revisar camaras y registros de portería");
        actions.add("Si es delito, informar a las autoridades competentes");
        break;
      case "PARQUEADERO":
        actions.add("Verificar contrato de asignacion de parqueadero");
        actions.add("Revisar reglamento de parqueaderos");
        break;
      case "ZONAS_COMUNES":
        actions.add("Verificar disponibilidad y reservas en el sistema");
        actions.add("Confirmar normas de uso aplicables");
        break;
      case "ASCENSOR":
        actions.add("Contactar proveedor de mantenimiento inmediatamente");
        actions.add("Verificar contrato de mantenimiento preventivo");
        actions.add("Si hay personas atrapadas, llamar a emergencias");
        break;
      case "LIMPIEZA":
        actions.add("Notificar al supervisor de aseo");
        actions.add("Verificar frecuencia de limpieza del area reportada");
        break;
      case "OBRAS":
        actions.add("Verificar permisos y aprobaciones de la obra");
        actions.add("Inspeccionar si afecta areas comunes o estructura");
        break;
      case "DOCUMENTOS":
        actions.add("Preparar el documento solicitado");
        actions.add("Verificar paz y salvo si aplica");
        break;
      case "GOBIERNO":
        actions.add("Incluir en agenda del proximo Consejo o Asamblea");
        actions.add("Consultar reglamento sobre el procedimiento aplicable");
        break;
      default:
        actions.add("Asignar al responsable del area correspondiente");
        break;
    }

    if (priority.equals("ALTA")) {
      actions.add("Notificar al administrador para seguimiento prioritario");
    }

    return actions;
  }

  private String estimateResponseTime(String priority, String type) {
    if (priority.equals("ALTA")) return "48 horas (respuesta preliminar)";
    if (type.equals("PETICION")) return "15 dias habiles (termino legal)";
    if (type.equals("QUEJA") || type.equals("RECLAMO")) return "15 dias habiles (termino legal)";
    return "15 dias habiles (termino legal)";
  }

  private boolean requiresEscalation(String priority, String type, String description) {
    if (priority.equals("ALTA")) return true;
    if (type.equals("QUEJA")) return true;
    if (description != null) {
      String lower = description.toLowerCase();
      if (lower.contains("denuncia") || lower.contains("abogado") || lower.contains("demanda") || lower.contains("tutela") || lower.contains("procuraduria") || lower.contains("personeria")) return true;
    }
    return false;
  }

  private String analyzeSentiment(String description) {
    if (description == null || description.isEmpty()) return "NEUTRO";
    String lower = description.toLowerCase();
    int negative = 0;
    int positive = 0;
    String[] negWords = {"malo", "pobre", "terrible", "horrible", "inaceptable", "nunca", "jamas", "denuncio", "queja", "fraude", "robo", "peligro", "urgente", "inmediato", "ya", "inservible", "inutil", "descuido", "negligencia", "abandono"};
    String[] posWords = {"gracias", "agradezco", "excelente", "buen", "feliz", "satisfecho", "colaboracion", "amable"};
    for (String w : negWords) if (lower.contains(w)) negative++;
    for (String w : posWords) if (lower.contains(w)) positive++;
    if (negative > positive + 1) return "NEGATIVO";
    if (positive > negative) return "POSITIVO";
    if (negative > 0) return "INSATISFECHO";
    return "NEUTRO";
  }

  private String adjustPriority(String currentPriority, String category, String description) {
    if (currentPriority.equals("ALTA")) return "ALTA";
    if (description != null) {
      String lower = description.toLowerCase();
      if (lower.contains("urgente") || lower.contains("emergencia") || lower.contains("peligro") || lower.contains("denuncia") || lower.contains("fraude")) return "ALTA";
    }
    if (category.equals("SEGURIDAD") || category.equals("ASCENSOR")) return "ALTA";
    return currentPriority;
  }

  // =================== BUDGET AI ANALYSIS ===================

  public Map<String, Object> analyzeBudget(Long budgetId) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<AnnualBudget> opt = annualBudgetRepository.findById(budgetId);
    if (opt.isEmpty() || !orgId.equals(opt.get().getOrganizationId())) {
      return Map.of("error", "Presupuesto no encontrado");
    }
    AnnualBudget budget = opt.get();
    List<BudgetItem> items = budgetItemRepository.findByOrganizationIdAndBudgetId(orgId, budgetId);
    List<BudgetInquiry> inquiries = budgetInquiryRepository.findByOrganizationIdAndBudgetId(orgId, budgetId);
    List<BudgetProposal> proposals = budgetProposalRepository.findByOrganizationIdAndBudgetId(orgId, budgetId);

    Map<String, Object> analysis = new LinkedHashMap<>();
    analysis.put("budgetName", budget.getBudgetName());
    analysis.put("budgetYear", budget.getBudgetYear());
    analysis.put("status", budget.getStatus());

    // 1. Resumen ejecutivo
    analysis.put("executiveSummary", generateExecutiveSummary(budget, items));

    // 2. Analisis de ejecucion
    analysis.put("executionAnalysis", analyzeExecution(budget, items));

    // 3. Alertas y anomalias
    analysis.put("alerts", detectBudgetAlerts(budget, items));

    // 4. Analisis por categoria
    analysis.put("categoryAnalysis", analyzeByCategory(items));

    // 5. Recomendaciones
    analysis.put("recommendations", generateBudgetRecommendations(budget, items, inquiries, proposals));

    // 6. Indicadores clave
    analysis.put("keyIndicators", calculateKeyIndicators(budget, items, inquiries, proposals));

    // 7. Riesgos
    analysis.put("risks", identifyRisks(budget, items, proposals));

    // 8. Conclusion
    analysis.put("conclusion", generateConclusion(budget, items));

    return analysis;
  }

  private String generateExecutiveSummary(AnnualBudget budget, List<BudgetItem> items) {
    StringBuilder sb = new StringBuilder();
    sb.append("El presupuesto \"").append(budget.getBudgetName()).append("\" del ano ").append(budget.getBudgetYear());
    sb.append(" se encuentra en estado ").append(budget.getStatus()).append(". ");

    double budgeted = parseAmount(budget.getTotalBudgetedAmount());
    double executed = parseAmount(budget.getTotalExecutedAmount());
    double remaining = parseAmount(budget.getTotalRemainingAmount());
    Double execPct = budget.getExecutionPercentage();

    if (budgeted > 0) {
      sb.append("El presupuesto total aprobado es de $").append(String.format("%,.0f", budgeted)).append(", ");
      sb.append("con una ejecucion de $").append(String.format("%,.0f", executed)).append(" ");
      sb.append("(").append(execPct != null ? String.format("%.1f", execPct) : "N/A").append("%). ");
      sb.append("El saldo restante es de $").append(String.format("%,.0f", remaining)).append(". ");
    }

    sb.append("El presupuesto cuenta con ").append(items.size()).append(" rubros distribuidos en diferentes categorias. ");

    if ("EJECUCION".equals(budget.getStatus())) {
      if (execPct != null && execPct > 75) {
        sb.append("La ejecucion esta en una fase avanzada, lo que requiere atencion para garantizar el cierre ordenado del periodo. ");
      } else if (execPct != null && execPct < 25) {
        sb.append("La ejecucion esta en una fase inicial, lo que sugiere que aun hay margen significativo para la ejecucion de los rubros pendientes. ");
      } else {
        sb.append("La ejecucion esta en una fase intermedia, con un avance acorde a lo esperado. ");
      }
    } else if ("BORRADOR".equals(budget.getStatus())) {
      sb.append("El presupuesto aun no ha sido aprobado, por lo que requiere revision y validacion antes de su entrada en vigencia. ");
    } else if ("CERRADO".equals(budget.getStatus())) {
      sb.append("El presupuesto ha sido cerrado y requiere analisis de cierre para lecciones aprendidas. ");
    }

    return sb.toString();
  }

  private Map<String, Object> analyzeExecution(AnnualBudget budget, List<BudgetItem> items) {
    Map<String, Object> result = new LinkedHashMap<>();
    double totalBudgeted = parseAmount(budget.getTotalBudgetedAmount());
    double totalExecuted = parseAmount(budget.getTotalExecutedAmount());
    Double execPct = budget.getExecutionPercentage();

    result.put("totalBudgeted", totalBudgeted);
    result.put("totalExecuted", totalExecuted);
    result.put("executionPercentage", execPct);

    // Calcular ejecucion real desde items
    double itemsBudgeted = 0, itemsExecuted = 0;
    for (BudgetItem item : items) {
      itemsBudgeted += parseAmount(item.getBudgetedAmount());
      itemsExecuted += parseAmount(item.getExecutedAmount());
    }
    result.put("itemsBudgetedTotal", itemsBudgeted);
    result.put("itemsExecutedTotal", itemsExecuted);
    result.put("itemsExecutionRate", itemsBudgeted > 0 ? Math.round(itemsExecuted / itemsBudgeted * 10000) / 100.0 : 0);

    // Rubros con mayor ejecucion
    List<Map<String, Object>> topExecuted = new ArrayList<>();
    List<Map<String, Object>> lowExecuted = new ArrayList<>();
    for (BudgetItem item : items) {
      double b = parseAmount(item.getBudgetedAmount());
      double e = parseAmount(item.getExecutedAmount());
      if (b > 0) {
        double rate = e / b * 100;
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("category", item.getCategory());
        m.put("subCategory", item.getSubCategory());
        m.put("budgeted", b);
        m.put("executed", e);
        m.put("rate", Math.round(rate * 10) / 10.0);
        if (rate >= 80) topExecuted.add(m);
        if (rate < 25) lowExecuted.add(m);
      }
    }
    topExecuted.sort((a, b) -> Double.compare((Double) b.get("rate"), (Double) a.get("rate")));
    lowExecuted.sort((a, b) -> Double.compare((Double) a.get("rate"), (Double) b.get("rate")));
    result.put("highExecutionItems", topExecuted);
    result.put("lowExecutionItems", lowExecuted);

    return result;
  }

  private List<Map<String, Object>> detectBudgetAlerts(AnnualBudget budget, List<BudgetItem> items) {
    List<Map<String, Object>> alerts = new ArrayList<>();
    Double execPct = budget.getExecutionPercentage();

    // Alerta: sobreejecucion
    if (execPct != null && execPct > 100) {
      Map<String, Object> alert = new LinkedHashMap<>();
      alert.put("type", "SOBREEJECUCION");
      alert.put("severity", "ALTA");
      alert.put("message", "El presupuesto tiene una ejecucion del " + String.format("%.1f%%", execPct) + ", superando el 100% del presupuesto aprobado. Se requiere justificacion y posible adición presupuestal.");
      alerts.add(alert);
    }

    // Alerta: subejecucion significativa
    if (execPct != null && execPct < 30 && "EJECUCION".equals(budget.getStatus())) {
      Map<String, Object> alert = new LinkedHashMap<>();
      alert.put("type", "SUBEJECUCION");
      alert.put("severity", "MEDIA");
      alert.put("message", "La ejecucion es solo del " + String.format("%.1f%%", execPct) + " a pesar de estar en estado EJECUCION. Se recomienda revisar los rubros pendientes.");
      alerts.add(alert);
    }

    // Alertas por item
    for (BudgetItem item : items) {
      double b = parseAmount(item.getBudgetedAmount());
      double e = parseAmount(item.getExecutedAmount());
      if (b > 0) {
        double rate = e / b * 100;
        if (rate > 100) {
          Map<String, Object> alert = new LinkedHashMap<>();
          alert.put("type", "SOBRE_EJECUCION_RUBRO");
          alert.put("severity", "ALTA");
          alert.put("message", "El rubro \"" + item.getCategory() + (item.getSubCategory() != null ? " - " + item.getSubCategory() : "") + "\" tiene una ejecucion del " + String.format("%.1f%%", rate) + ", superando lo presupuestado.");
          alerts.add(alert);
        } else if (rate > 90 && rate <= 100) {
          Map<String, Object> alert = new LinkedHashMap<>();
          alert.put("type", "AGOTAMIENTO_RUBRO");
          alert.put("severity", "MEDIA");
          alert.put("message", "El rubro \"" + item.getCategory() + (item.getSubCategory() != null ? " - " + item.getSubCategory() : "") + "\" esta al " + String.format("%.1f%%", rate) + " de ejecucion. Proximo a agotarse.");
          alerts.add(alert);
        }
      }
    }

    // Alerta: presupuesto en borrador por mucho tiempo
    if ("BORRADOR".equals(budget.getStatus()) && budget.getCreatedAt() != null) {
      long daysInDraft = ChronoUnit.DAYS.between(budget.getCreatedAt(), LocalDate.now());
      if (daysInDraft > 60) {
        Map<String, Object> alert = new LinkedHashMap<>();
        alert.put("type", "BORRADOR_PROLONGADO");
        alert.put("severity", "MEDIA");
        alert.put("message", "El presupuesto lleva " + daysInDraft + " dias en estado BORRADOR. Se recomienda su revision y aprobacion.");
        alerts.add(alert);
      }
    }

    return alerts;
  }

  private List<Map<String, Object>> analyzeByCategory(List<BudgetItem> items) {
    Map<String, double[]> byCat = new LinkedHashMap<>(); // [budgeted, executed]
    for (BudgetItem item : items) {
      String cat = item.getCategory() != null ? item.getCategory() : "Sin categoria";
      double b = parseAmount(item.getBudgetedAmount());
      double e = parseAmount(item.getExecutedAmount());
      byCat.computeIfAbsent(cat, k -> new double[]{0, 0});
      byCat.get(cat)[0] += b;
      byCat.get(cat)[1] += e;
    }

    List<Map<String, Object>> result = new ArrayList<>();
    for (Map.Entry<String, double[]> entry : byCat.entrySet()) {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("category", entry.getKey());
      m.put("budgeted", entry.getValue()[0]);
      m.put("executed", entry.getValue()[1]);
      m.put("remaining", entry.getValue()[0] - entry.getValue()[1]);
      m.put("executionRate", entry.getValue()[0] > 0 ? Math.round(entry.getValue()[1] / entry.getValue()[0] * 10000) / 100.0 : 0);
      m.put("participation", 0); // se calcula despues
      result.add(m);
    }

    // Calcular participacion
    double totalBudgeted = result.stream().mapToDouble(r -> (Double) r.get("budgeted")).sum();
    for (Map<String, Object> r : result) {
      double b = (Double) r.get("budgeted");
      r.put("participation", totalBudgeted > 0 ? Math.round(b / totalBudgeted * 10000) / 100.0 : 0);
    }

    result.sort((a, b) -> Double.compare((Double) b.get("budgeted"), (Double) a.get("budgeted")));
    return result;
  }

  private List<String> generateBudgetRecommendations(AnnualBudget budget, List<BudgetItem> items, List<BudgetInquiry> inquiries, List<BudgetProposal> proposals) {
    List<String> recs = new ArrayList<>();
    Double execPct = budget.getExecutionPercentage();

    if (execPct != null && execPct > 100) {
      recs.add("Realizar una adicion presupuestal formal con justificacion documentada para los rubros que superaron el 100% de ejecucion.");
    }
    if (execPct != null && execPct < 30 && "EJECUCION".equals(budget.getStatus())) {
      recs.add("Revisar los rubros con baja ejecucion y determinar si requieren reprogramacion o si los recursos pueden ser reasignados.");
    }
    if (execPct != null && execPct > 75 && "EJECUCION".equals(budget.getStatus())) {
      recs.add("Iniciar preparacion del cierre presupuestal y consolidar soportes de ejecucion por rubro.");
    }
    if ("BORRADOR".equals(budget.getStatus())) {
      recs.add("Someter el presupuesto a aprobacion del organo competente (Consejo de Administracion o Asamblea General).");
    }

    // Rubros con sobreejecucion
    for (BudgetItem item : items) {
      double b = parseAmount(item.getBudgetedAmount());
      double e = parseAmount(item.getExecutedAmount());
      if (b > 0 && e / b > 1.0) {
        recs.add("Justificar la sobreejecucion del rubro \"" + item.getCategory() + "\" mediante soporte documental.");
        break;
      }
    }

    // Consultas pendientes
    long pendingInquiries = inquiries.stream().filter(i -> "PENDIENTE".equals(i.getStatus())).count();
    if (pendingInquiries > 0) {
      recs.add("Atender " + pendingInquiries + " consulta(s) pendiente(s) sobre el presupuesto para garantizar transparencia.");
    }

    // Propuestas abiertas
    long openProposals = proposals.stream().filter(p -> "ABIERTA".equals(p.getStatus())).count();
    if (openProposals > 0) {
      recs.add("Cerrar y publicar resultados de " + openProposals + " propuesta(s) abierta(s) para mantener la participacion comunitaria.");
    }

    if (recs.isEmpty()) {
      recs.add("El presupuesto se encuentra en condiciones adecuadas. Se recomienda mantener el seguimiento regular de la ejecucion.");
    }

    return recs;
  }

  private Map<String, Object> calculateKeyIndicators(AnnualBudget budget, List<BudgetItem> items, List<BudgetInquiry> inquiries, List<BudgetProposal> proposals) {
    Map<String, Object> indicators = new LinkedHashMap<>();
    indicators.put("totalRubros", items.size());
    indicators.put("rubrosEjecutadosAl80", items.stream().filter(i -> {
      double b = parseAmount(i.getBudgetedAmount());
      double e = parseAmount(i.getExecutedAmount());
      return b > 0 && e / b >= 0.8;
    }).count());
    indicators.put("rubrosSinEjecucion", items.stream().filter(i -> {
      double e = parseAmount(i.getExecutedAmount());
      return e == 0;
    }).count());
    indicators.put("totalConsultas", inquiries.size());
    indicators.put("consultasPendientes", inquiries.stream().filter(i -> "PENDIENTE".equals(i.getStatus())).count());
    indicators.put("totalPropuestas", proposals.size());
    indicators.put("propuestasAbiertas", proposals.stream().filter(p -> "ABIERTA".equals(p.getStatus())).count());
    indicators.put("participacionVotos", proposals.stream().mapToInt(p -> {
      int v = 0;
      if (p.getVotesFor() != null) v += p.getVotesFor();
      if (p.getVotesAgainst() != null) v += p.getVotesAgainst();
      if (p.getVotesAbstain() != null) v += p.getVotesAbstain();
      return v;
    }).sum());

    return indicators;
  }

  private List<Map<String, Object>> identifyRisks(AnnualBudget budget, List<BudgetItem> items, List<BudgetProposal> proposals) {
    List<Map<String, Object>> risks = new ArrayList<>();
    Double execPct = budget.getExecutionPercentage();

    if (execPct != null && execPct > 100) {
      Map<String, Object> risk = new LinkedHashMap<>();
      risk.put("risk", "Sobreejecucion presupuestal");
      risk.put("level", "ALTO");
      risk.put("description", "La ejecucion supera el presupuesto aprobado, lo que puede generar pasivos laborales o contractuales no contemplados.");
      risks.add(risk);
    }

    long overExecItems = items.stream().filter(i -> {
      double b = parseAmount(i.getBudgetedAmount());
      double e = parseAmount(i.getExecutedAmount());
      return b > 0 && e / b > 1.0;
    }).count();
    if (overExecItems > 0) {
      Map<String, Object> risk = new LinkedHashMap<>();
      risk.put("risk", "Rubros con sobreejecucion");
      risk.put("level", "MEDIO");
      risk.put("description", overExecItems + " rubro(s) superan el 100% de ejecucion. Se requiere adicion presupuestal o justificacion.");
      risks.add(risk);
    }

    long zeroExecItems = items.stream().filter(i -> {
      double e = parseAmount(i.getExecutedAmount());
      return e == 0;
    }).count();
    if (zeroExecItems > items.size() / 2 && "EJECUCION".equals(budget.getStatus())) {
      Map<String, Object> risk = new LinkedHashMap<>();
      risk.put("risk", "Baja ejecucion general");
      risk.put("level", "MEDIO");
      risk.put("description", zeroExecItems + " de " + items.size() + " rubros no tienen ejecucion. Puede indicar problemas de gestion o planificacion.");
      risks.add(risk);
    }

    long openProposals = proposals.stream().filter(p -> "ABIERTA".equals(p.getStatus())).count();
    if (openProposals > 3) {
      Map<String, Object> risk = new LinkedHashMap<>();
      risk.put("risk", "Propuestas sin cerrar");
      risk.put("level", "BAJO");
      risk.put("description", "Hay " + openProposals + " propuestas abiertas. Se recomienda cerrar las que ya tengan suficiente participacion.");
      risks.add(risk);
    }

    return risks;
  }

  private String generateConclusion(AnnualBudget budget, List<BudgetItem> items) {
    StringBuilder sb = new StringBuilder();
    Double execPct = budget.getExecutionPercentage();
    sb.append("En conclusion, el presupuesto \"").append(budget.getBudgetName()).append("\" ");
    if (execPct != null) {
      if (execPct > 100) {
        sb.append("presenta una sobreejecucion que requiere atencion inmediata y justificacion formal. ");
      } else if (execPct >= 75) {
        sb.append("muestra un avance saludable cercano al cierre, con una buena ejecucion de los rubros principales. ");
      } else if (execPct >= 40) {
        sb.append("presenta un desarrollo adecuado, con oportunidades de mejora en la ejecucion de algunos rubros. ");
      } else {
        sb.append("tiene un nivel de ejecucion bajo que requiere acciones para acelerar el desarrollo de los rubros pendientes. ");
      }
    }
    sb.append("Se recomienda mantener el seguimiento continuo, garantizar la transparencia ante los organos de control ");
    sb.append("y documentar todas las decisiones presupuestales para el cierre del periodo.");

    return sb.toString();
  }

  private double parseAmount(String value) {
    if (value == null || value.isEmpty()) return 0;
    try {
      return Double.parseDouble(value.replaceAll("[^0-9.-]", ""));
    } catch (NumberFormatException e) {
      return 0;
    }
  }
}
