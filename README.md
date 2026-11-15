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

# 4. Poblar la base de datos con datos de prueba (Seed con 22 tareas)
pnpm run seed
# o alternativamente: pnpm prisma db seed

# 5. Iniciar la aplicación en modo desarrollo
pnpm run start:dev

# 6. Ejecutar tests unitarios
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
- **Poblado de datos (Seed):** Se creó el script idempotente [prisma/seed.ts](prisma/seed.ts) que siembra 22 tareas realistas con variedad de estados (`DONE`, `IN_PROGRESS`, `PENDING`), asignados y fechas para facilitar las pruebas manuales y en Postman.

---

## 🏗 Decisiones de Arquitectura y Diseño

Dado el límite de tiempo (3 horas), prioricé la robustez de la API y la entrega de valor sobre la creación de un ecosistema complejo.

### Stack Tecnológico:
- **NestJS:** Elegido por su arquitectura modular y sus herramientas integradas (como `ValidationPipe`), que permiten un desarrollo rápido, escalable y mantenible.
- **Prisma ORM:** Para manejar las migraciones de forma segura y fuertemente tipada, agilizando el mapeo relacional con PostgreSQL.

### Modelo de Datos:
- Para mantener la simplicidad exigida por el tiempo, el modelo gira en torno a una única entidad `Task`.
- El campo `assignee` se modeló como un `String` opcional en lugar de crear una entidad `User` separada, evitando la complejidad innecesaria de gestionar tablas relacionales, claves foráneas y un módulo adicional de usuarios.

### Paginación y Filtros:
- Implementada nativamente usando `skip` y `take` de Prisma.
- Ejecución concurrente mediante `prisma.$transaction` para obtener el total (`count`) y los registros (`findMany`) en un solo viaje a la base de datos.
- Respuesta estructurada en `{ data, meta }` para facilitar la integración desde cualquier frontend.

---

## ⏳ ¿Qué haría con más tiempo?

Si este fuera un proyecto de producción a largo plazo, implementaría lo siguiente:

1. **Gestión de Usuarios (Auth/Authz):**
   - Crearía una entidad `User` y relaciones `1:N` con las tareas.
   - Implementaría autenticación (JWT o sesiones) y autorización (Guards/RBAC) para que un usuario solo pueda editar o ver las tareas que le corresponden.

2. **Documentación Swagger / OpenAPI:**
   - Añadiría `@nestjs/swagger` para autogenerar la documentación interactiva de la API con Swagger UI y facilitar las pruebas a consumidores externos.

3. **Tests End-to-End (e2e) y CI/CD:**
   - Configuraría tests de integración levantando contenedores de base de datos efímeros con **Testcontainers**.
   - Crearía pipelines con **GitHub Actions** para ejecutar linter, compilación y suite de pruebas en cada Pull Request.

4. **Manejo de Errores Global (Exception Filters):**
   - Centralizaría la respuesta de errores de Prisma y NestJS mediante un `ExceptionFilter` personalizado en un único formato estándar y con logging estructurado.

---

## 🤖 Uso de Inteligencia Artificial (Transparencia)

Durante el desarrollo, utilicé IA (Gemini / Antigravity) como asistente tipo *pair programming* para agilizar el boilerplate (código repetitivo):

### Qué le pedí:
- Generación de comandos base de Prisma (`schema.prisma` inicial).
- Scaffolding de los DTOs de `class-validator` basados en las restricciones solicitadas en el enunciado.
- Estructura base para 3 tests unitarios utilizando `jest.fn()` para mockear Prisma.

### Qué acepté:
- Los decoradores de validación de `class-validator`, ya que es sintaxis estándar.
- La configuración inicial del módulo y servicio de Prisma.

### Qué corregí o adapté:
- Definí yo mismo la arquitectura (un solo modelo vs múltiples tablas) por las restricciones de tiempo.
- Ajusté la lógica de paginación y la estructura de respuesta (`meta` y `data`) para que fuera limpia y óptima, asegurando el uso de `$transaction` para contar el total y buscar los registros concurrentemente.
