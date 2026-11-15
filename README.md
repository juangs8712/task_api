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

# 5. Ejecutar tests unitarios
pnpm test
```

## Endpoints del CRUD (`/tasks`)

| Método | Endpoint     | Parámetros Query (Opcionales)                        | Descripción                       |
| :----- | :----------- | :--------------------------------------------------- | :-------------------------------- |
| POST   | `/tasks`     | -                                                    | Crear una nueva tarea             |
| GET    | `/tasks`     | `page` (def: 1), `limit` (def: 10), `status`, `assignee` | Listar tareas con paginación y filtros |
| GET    | `/tasks/:id` | -                                                    | Obtener una tarea por su ID       |
| PATCH  | `/tasks/:id` | -                                                    | Actualizar parcialmente una tarea |
| DELETE | `/tasks/:id` | -                                                    | Eliminar una tarea por su ID      |

### Formato de respuesta paginada (`GET /tasks`)

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Título de la tarea",
      "description": "Descripción opcional",
      "status": "PENDING",
      "assignee": "Responsable opcional",
      "dueDate": "2026-12-01T12:00:00.000Z",
      "createdAt": "2026-11-15T03:28:45.650Z",
      "updatedAt": "2026-11-15T03:28:45.650Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

> **Colección de Postman:** Puedes importar directamente el archivo [`tasks-api.postman_collection.json`](tasks-api.postman_collection.json) en Postman para probar todos los endpoints y validaciones de forma interactiva.

## Historial de cambios

- **Configuración inicial:** Se configuró el contenedor de PostgreSQL 16 con Docker Compose y las variables de entorno (`.env`) para la conexión a la base de datos.
- **Modelo de datos y migración inicial:** Se definieron el enum `TaskStatus` y el modelo `Task` en `prisma/schema.prisma`, la configuración de conexión en `prisma.config.mjs` y se ejecutó la migración inicial (`init`) en PostgreSQL.
- **Módulo Prisma y CRUD básico:** Se implementó `PrismaService` global (`OnModuleInit`/`OnModuleDestroy`) y el módulo de tareas (`TasksService`, `TasksController`) con endpoints REST y manejo de excepciones `NotFoundException` (404).
- **Validación robusta con DTOs:** Se integraron `class-validator`, `class-transformer` y `@nestjs/mapped-types`. Se configuró `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`, asegurando respuestas `400 Bad Request` ante entradas inválidas.
- **Paginación y filtrado condicional:** Se creó `GetTasksFilterDto` con validación y transformación de query parameters (`page`, `limit`, `status`, `assignee`). Se implementó una consulta atómica con `prisma.$transaction` para calcular el total y los registros en un solo viaje a la base de datos, retornando la estructura estandarizada `{ data, meta }`.
- **Tests unitarios críticos:** Se implementaron pruebas unitarias con Jest para `TasksService` ([tasks.service.spec.ts](src/tasks/tasks.service.spec.ts)) cubriendo creación exitosa, paginación con `$transaction` y lanzamiento de `NotFoundException` (404) ante IDs inexistentes, con tipado estricto de mocks.
