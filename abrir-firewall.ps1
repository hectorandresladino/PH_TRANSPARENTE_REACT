Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Configurando Firewall para PH Transparente" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Eliminar reglas previas con el mismo nombre (si existen) para evitar duplicados/errores
Remove-NetFirewallRule -DisplayName "PH Backend 8081" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "PH Frontend 5173" -ErrorAction SilentlyContinue

# Crear reglas de entrada para los puertos del backend y frontend
New-NetFirewallRule -DisplayName "PH Backend 8081" -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow -Profile Any | Out-Null
New-NetFirewallRule -DisplayName "PH Frontend 5173" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow -Profile Any | Out-Null

Write-Host "Verificando reglas creadas..." -ForegroundColor Yellow
$reglas = Get-NetFirewallRule -DisplayName "PH Backend 8081","PH Frontend 5173" -ErrorAction SilentlyContinue
if ($reglas) {
    $reglas | Select-Object DisplayName, Enabled, Direction, Action | Format-Table -AutoSize
    Write-Host "LISTO: Reglas de firewall creadas correctamente." -ForegroundColor Green
} else {
    Write-Host "ERROR: No se pudieron crear las reglas. Asegurate de ejecutar como Administrador." -ForegroundColor Red
}

Write-Host ""
Read-Host "Presiona ENTER para cerrar esta ventana"
