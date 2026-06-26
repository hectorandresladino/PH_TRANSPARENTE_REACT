-- ============================================
-- PH Transparente - Base de Datos PostgreSQL
-- Script de Inicialización
-- ============================================

-- Asegurar que estamos en la base de datos correcta
\c phdb;

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tablas (se crean automáticamente por JPA)
-- Este archivo es referencia de la estructura
-- ============================================

-- Tabla: users
-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) NOT NULL,
--     email VARCHAR(255),
--     full_name VARCHAR(255),
--     phone VARCHAR(50),
--     active BOOLEAN DEFAULT TRUE
-- );

-- Tabla: roles
-- CREATE TABLE IF NOT EXISTS roles (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(50) NOT NULL UNIQUE,
--     description TEXT,
--     modules TEXT,
--     default_password VARCHAR(255)
-- );

-- ============================================
-- Datos iniciales (opcional, ya los crea DataInitializer.java)
-- ============================================

-- Insertar roles iniciales
-- INSERT INTO roles (name, description, modules, default_password) VALUES
-- ('ADMIN', 'Administrador del sistema con acceso total',
--  'dashboard,users,pqr,payments,reservations,visitors,contracts,fines,documents,assemblies,votes,councils,security,contractors,property-units,reserve-funds,annual-budgets,insurance-policies,bank-accounts,official-minutes,horizontal-property-regulations,alerts,transparency,authorizations,reports,personnel-ratings,support-tasks,appstore',
--  'admin123'),
-- ('CONTADOR', 'Contador con acceso a módulos financieros',
--  'dashboard,payments,contracts,fines,documents,contractors,property-units,reserve-funds,annual-budgets,bank-accounts,alerts,reports,personnel-ratings,support-tasks',
--  'contador123'),
-- ('REVISOR_FISCAL', 'Revisor Fiscal con acceso a auditoría y legales',
--  'dashboard,payments,contracts,fines,documents,assemblies,votes,contractors,property-units,reserve-funds,annual-budgets,bank-accounts,official-minutes,alerts,reports,personnel-ratings,support-tasks',
--  'revisor123'),
-- ('CONSEJERO', 'Consejero con acceso a gestión y decisiones',
--  'dashboard,assemblies,votes,councils,documents,security,contractors,property-units,annual-budgets,official-minutes,horizontal-property-regulations,alerts,reports,personnel-ratings,support-tasks',
--  'consejero123'),
-- ('COPROPIETARIO', 'Copropietario con acceso a módulos básicos y transparencia',
--  'dashboard,pqr,reservations,visitors,documents,payments,property-units,alerts,transparency,reports,personnel-ratings,support-tasks',
--  'copropietario123'),
-- ('VIGILANCIA', 'Empresa de vigilancia con acceso a módulos de seguridad',
--  'dashboard,security,visitors,property-units,alerts',
--  'vigilancia123')
-- ON CONFLICT (name) DO NOTHING;

-- Insertar usuario admin inicial
-- INSERT INTO users (username, password, role, email, full_name, phone, active) VALUES
-- ('admin', 'admin123', 'ADMIN', 'admin@phtransparente.com', 'Administrador del Sistema', '+57 300 123 4567', TRUE)
-- ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Verificación
-- ============================================

SELECT current_database() AS base_de_datos, current_user AS usuario_actual;
