[CmdletBinding()]
param(
  [string]$Project = "",
  [string]$GitUri = "https://github.com/hectorandresladino/PH_TRANSPARENTE_REACT.git",
  [string]$GitRef = "main",
  [string]$ApplicationHostname = "",
  [string]$CorsAllowedOrigins = "https://example.invalid",
  [string]$SuperAdminUsername = "superadmin",
  [string]$SuperAdminEmail = "admin@example.com",
  [string]$SuperAdminPassword = "",
  [string]$DatabasePassword = "",
  [string]$JwtSecret = "",
  [string]$EmailUsername = "",
  [string]$EmailPassword = "",
  [string]$EmailFrom = "no-reply@example.com",
  [string]$StorageSize = "5Gi",
  [ValidateRange(1, 10)][int]$BackendReplicas = 1,
  [ValidateRange(1, 10)][int]$FrontendReplicas = 1,
  [switch]$WaitForRollout
)

$ErrorActionPreference = "Stop"
$templatePath = Join-Path $PSScriptRoot "ph-transparente-template.yaml"
$secretName = "ph-transparente-secrets"

function New-AlphaNumericSecret([int]$Length) {
  $alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  $bytes = New-Object byte[] $Length
  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $generator.GetBytes($bytes)
  } finally {
    $generator.Dispose()
  }
  return -join ($bytes | ForEach-Object { $alphabet[$_ % $alphabet.Length] })
}

function New-JwtSecret {
  $bytes = New-Object byte[] 48
  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $generator.GetBytes($bytes)
  } finally {
    $generator.Dispose()
  }
  return [Convert]::ToBase64String($bytes)
}

function Get-SecretValue([string]$Key) {
  $encoded = & oc get secret $secretName -o "jsonpath={.data.$Key}"
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($encoded)) {
    return ""
  }
  return [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded))
}

function Wait-ForDeployment([string]$Name, [string]$Timeout) {
  & oc rollout status "deployment/$Name" "--timeout=$Timeout" | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "El deployment $Name no quedo disponible dentro de $Timeout."
  }
}

if (-not (Get-Command oc -ErrorAction SilentlyContinue)) {
  throw "No se encontro la CLI oc. Instalela e inicie sesion antes de ejecutar este script."
}

& oc whoami *> $null
if ($LASTEXITCODE -ne 0) {
  throw "No hay una sesion activa de OpenShift. Ejecute oc login primero."
}

if (-not [string]::IsNullOrWhiteSpace($Project)) {
  & oc get project $Project *> $null
  if ($LASTEXITCODE -eq 0) {
    & oc project $Project | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "No fue posible seleccionar el proyecto $Project."
    }
  } else {
    & oc new-project $Project | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "No fue posible seleccionar o crear el proyecto $Project."
    }
  }
} else {
  $Project = [string](& oc project -q)
  $Project = $Project.Trim()
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($Project)) {
    throw "No hay un proyecto seleccionado. Use -Project o ejecute oc project."
  }
}

$existingSecret = [string](& oc get secret $secretName --ignore-not-found=true -o name)
$existingSecret = $existingSecret.Trim()
if (-not [string]::IsNullOrWhiteSpace($existingSecret)) {
  # Un redeploy no debe rotar automaticamente la clave de PostgreSQL ni JWT.
  $DatabasePassword = Get-SecretValue "DATABASE_PASSWORD"
  $JwtSecret = Get-SecretValue "JWT_SECRET"
  $SuperAdminUsername = Get-SecretValue "APP_BOOTSTRAP_SUPERADMIN_USERNAME"
  $SuperAdminPassword = Get-SecretValue "APP_BOOTSTRAP_SUPERADMIN_PASSWORD"
  $SuperAdminEmail = Get-SecretValue "APP_BOOTSTRAP_SUPERADMIN_EMAIL"
  $EmailUsername = Get-SecretValue "EMAIL_USERNAME"
  $EmailPassword = Get-SecretValue "EMAIL_PASSWORD"
  Write-Host "Se reutilizaran los secretos existentes de $secretName."
} else {
  if ([string]::IsNullOrWhiteSpace($DatabasePassword)) {
    $DatabasePassword = New-AlphaNumericSecret 32
  }
  if ([string]::IsNullOrWhiteSpace($JwtSecret)) {
    $JwtSecret = New-JwtSecret
  }
  if ([string]::IsNullOrWhiteSpace($SuperAdminPassword)) {
    $SuperAdminPassword = "Aa1!$(New-AlphaNumericSecret 20)"
  }
}

try {
  $jwtBytes = [Convert]::FromBase64String($JwtSecret)
} catch {
  throw "JwtSecret debe ser una cadena Base64 valida."
}
if ($jwtBytes.Length -lt 32) {
  throw "JwtSecret debe representar al menos 32 bytes."
}
if (-not [string]::IsNullOrWhiteSpace($SuperAdminPassword) -and
    ($SuperAdminPassword -notmatch '[A-Z]' -or
     $SuperAdminPassword -notmatch '[a-z]' -or
     $SuperAdminPassword -notmatch '\d' -or
     $SuperAdminPassword -notmatch '[!@#$%^&*()_+\-=\[\]{};'':"\\|,.<>\/?]')) {
  throw "SuperAdminPassword debe incluir mayuscula, minuscula, numero y caracter especial."
}

$processArgs = @(
  "process", "-f", $templatePath,
  "-p", "SOURCE_REPOSITORY_URL=$GitUri",
  "-p", "SOURCE_REPOSITORY_REF=$GitRef",
  "-p", "APPLICATION_HOSTNAME=$ApplicationHostname",
  "-p", "CORS_ALLOWED_ORIGINS=$CorsAllowedOrigins",
  "-p", "DATABASE_PASSWORD=$DatabasePassword",
  "-p", "JWT_SECRET=$JwtSecret",
  "-p", "SUPERADMIN_USERNAME=$SuperAdminUsername",
  "-p", "SUPERADMIN_PASSWORD=$SuperAdminPassword",
  "-p", "SUPERADMIN_EMAIL=$SuperAdminEmail",
  "-p", "EMAIL_USERNAME=$EmailUsername",
  "-p", "EMAIL_PASSWORD=$EmailPassword",
  "-p", "EMAIL_FROM=$EmailFrom",
  "-p", "POSTGRESQL_STORAGE_SIZE=$StorageSize",
  "-p", "BACKEND_REPLICAS=$BackendReplicas",
  "-p", "FRONTEND_REPLICAS=$FrontendReplicas"
)

$rendered = & oc @processArgs
if ($LASTEXITCODE -ne 0) {
  throw "OpenShift no pudo procesar la plantilla."
}

$rendered | & oc apply -f - | Out-Host
if ($LASTEXITCODE -ne 0) {
  throw "OpenShift no pudo aplicar los componentes."
}

if ($WaitForRollout) {
  Write-Host "Esperando los despliegues; los BuildConfig publicaran las imagenes automaticamente..."
  Wait-ForDeployment "ph-postgresql" "5m"
  Wait-ForDeployment "ph-backend" "10m"
  Wait-ForDeployment "ph-frontend" "5m"
}

$routeHost = [string](& oc get route ph-transparente -o 'jsonpath={.spec.host}')
$routeHost = $routeHost.Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($routeHost)) {
  throw "No fue posible obtener el hostname de la Route ph-transparente."
}
Write-Host ""
Write-Host "Despliegue aplicado en el proyecto: $Project"
Write-Host "Aplicacion: https://$routeHost"
Write-Host "Usuario inicial: $SuperAdminUsername"
Write-Host "Para consultar la clave inicial ejecute:"
Write-Host "oc extract secret/$secretName --keys=APP_BOOTSTRAP_SUPERADMIN_PASSWORD --to=-"
