#!/bin/bash

# Script de despliegue para OpenShift Sandbox

echo "=== Desplegando PH Transparente en OpenShift Sandbox ==="

# Login en OpenShift (requiere token)
echo "Iniciando sesión en OpenShift..."
# oc login --token=<YOUR_TOKEN> --server=<YOUR_SERVER>

# Crear proyecto si no existe
echo "Creando proyecto ph-transparente..."
oc new-project ph-transparente --display-name="PH Transparente" --description="Sistema de Propiedad Horizontal" || echo "Proyecto ya existe"

# Desplegar secret de base de datos
echo "Desplegando secret de base de datos..."
oc apply -f db-secret.yaml

# Desplegar backend
echo "Construyendo y desplegando backend..."
cd ../backend-springboot
oc new-build --name ph-transparente-backend --binary --strategy=docker || echo "BuildConfig ya existe"
oc start-build ph-transparente-backend --from-dir=. --follow
cd ../openshift
oc apply -f backend-deployment.yaml
oc apply -f backend-service.yaml

# Desplegar frontend
echo "Construyendo y desplegando frontend..."
cd ../frontend-react
oc new-build --name ph-transparente-frontend --binary --strategy=docker || echo "BuildConfig ya existe"
oc start-build ph-transparente-frontend --from-dir=. --follow
cd ../openshift
oc apply -f frontend-deployment.yaml
oc apply -f frontend-service.yaml

# Desplegar route
echo "Desplegando route para acceso externo..."
oc apply -f route.yaml

echo "=== Despliegue completado ==="
echo "Obteniendo URL de acceso..."
oc get route ph-transparente-route -o jsonpath='{.spec.host}'

echo ""
echo "Para ver el estado de los pods:"
echo "oc get pods -n ph-transparente"
echo ""
echo "Para ver los logs:"
echo "oc logs -f deployment/ph-transparente-backend -n ph-transparente"
echo "oc logs -f deployment/ph-transparente-frontend -n ph-transparente"
