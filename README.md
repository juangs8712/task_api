<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Tasks API

## Comandos para levantar el proyecto

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar la base de datos con Docker
docker compose up -d

# 3. Aplicar migraciones y generar el cliente de Prisma
pnpm prisma migrate deploy
pnpm prisma generate

# 4. Iniciar la aplicación en modo desarrollo
pnpm run start:dev
```

## Historial de cambios

- **Configuración inicial:** Se configuró el contenedor de PostgreSQL 16 con Docker Compose y las variables de entorno (`.env`) para la conexión a la base de datos.
- **Modelo de datos y migración inicial:** Se definieron el enum `TaskStatus` y el modelo `Task` en `prisma/schema.prisma`, la configuración de conexión en `prisma.config.mjs` y se ejecutó la migración inicial (`init`) en PostgreSQL.
