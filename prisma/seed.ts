import { PrismaClient, TaskStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'node:fs';
import path from 'node:path';

function getDatabaseUrl(): string {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (match) return match[1];
  }
  return process.env.DATABASE_URL || '';
}

const connectionString = getDatabaseUrl();
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const seedTasks = [
  {
    title: 'Configurar entorno de desarrollo',
    description: 'Instalar Docker, Node.js y pnpm en la máquina local',
    status: TaskStatus.DONE,
    assignee: 'Juan Guerra',
    dueDate: new Date('2026-11-10T12:00:00.000Z'),
  },
  {
    title: 'Inicializar proyecto NestJS',
    description: 'Generar estructura modular base con TypeScript y ESM',
    status: TaskStatus.DONE,
    assignee: 'Juan Guerra',
    dueDate: new Date('2026-11-11T12:00:00.000Z'),
  },
  {
    title: 'Crear docker-compose para PostgreSQL',
    description: 'Configurar PostgreSQL 16 con volumen persistente',
    status: TaskStatus.DONE,
    assignee: 'DevOps Team',
    dueDate: new Date('2026-11-12T12:00:00.000Z'),
  },
  {
    title: 'Diseñar schema de Prisma',
    description: 'Definir modelo Task y enum TaskStatus con mapeo a tabla tasks',
    status: TaskStatus.DONE,
    assignee: 'Carlos Mendoza',
    dueDate: new Date('2026-11-13T12:00:00.000Z'),
  },
  {
    title: 'Ejecutar migración inicial',
    description: 'Crear tabla tasks e índices en la base de datos PostgreSQL',
    status: TaskStatus.DONE,
    assignee: 'Carlos Mendoza',
    dueDate: new Date('2026-11-14T12:00:00.000Z'),
  },
  {
    title: 'Implementar PrismaService',
    description: 'Configurar driver adapter PrismaPg y ciclo de vida de conexión',
    status: TaskStatus.DONE,
    assignee: 'Juan Guerra',
    dueDate: new Date('2026-11-14T18:00:00.000Z'),
  },
  {
    title: 'Crear endpoints CRUD básicos',
    description: 'Controlador y servicio de tareas en NestJS con HTTP 404 en not found',
    status: TaskStatus.DONE,
    assignee: 'Juan Guerra',
    dueDate: new Date('2026-11-15T12:00:00.000Z'),
  },
  {
    title: 'Implementar validación con class-validator',
    description: 'Crear DTOs CreateTaskDto y UpdateTaskDto con PartialType',
    status: TaskStatus.DONE,
    assignee: 'Ana López',
    dueDate: new Date('2026-11-16T12:00:00.000Z'),
  },
  {
    title: 'Configurar ValidationPipe global',
    description: 'Habilitar whitelist y forbidNonWhitelisted en main.ts',
    status: TaskStatus.DONE,
    assignee: 'Ana López',
    dueDate: new Date('2026-11-17T12:00:00.000Z'),
  },
  {
    title: 'Añadir paginación en GET /tasks',
    description: 'Implementar limit y page con skip/take estructurando data y meta',
    status: TaskStatus.DONE,
    assignee: 'Maria Gómez',
    dueDate: new Date('2026-11-18T12:00:00.000Z'),
  },
  {
    title: 'Implementar filtros por status y assignee',
    description: 'Optimizar queries concurrentes usando prisma.$transaction',
    status: TaskStatus.DONE,
    assignee: 'Maria Gómez',
    dueDate: new Date('2026-11-19T12:00:00.000Z'),
  },
  {
    title: 'Escribir tests unitarios para TasksService',
    description: 'Cubrir create, findAll con paginación y NotFoundException con Jest',
    status: TaskStatus.DONE,
    assignee: 'Juan Guerra',
    dueDate: new Date('2026-11-20T12:00:00.000Z'),
  },
  {
    title: 'Configurar CI/CD en GitHub Actions',
    description: 'Automatizar linter, build y tests unitarios en cada pull request',
    status: TaskStatus.IN_PROGRESS,
    assignee: 'DevOps Team',
    dueDate: new Date('2026-12-01T12:00:00.000Z'),
  },
  {
    title: 'Implementar autenticación con JWT',
    description: 'Crear módulo de usuarios, hashing de passwords y Guards de autenticación',
    status: TaskStatus.IN_PROGRESS,
    assignee: 'Carlos Mendoza',
    dueDate: new Date('2026-12-05T12:00:00.000Z'),
  },
  {
    title: 'Documentar API con Swagger OpenAPI',
    description: 'Instalar @nestjs/swagger y documentar DTOs y respuestas HTTP',
    status: TaskStatus.IN_PROGRESS,
    assignee: 'Ana López',
    dueDate: new Date('2026-12-07T12:00:00.000Z'),
  },
  {
    title: 'Implementar ExceptionFilter global',
    description: 'Centralizar respuestas de error de Prisma y NestJS con formato uniforme',
    status: TaskStatus.IN_PROGRESS,
    assignee: 'Maria Gómez',
    dueDate: new Date('2026-12-10T12:00:00.000Z'),
  },
  {
    title: 'Añadir tests de integración e2e',
    description: 'Levantar base de datos efímera para pruebas completas de endpoints HTTP',
    status: TaskStatus.PENDING,
    assignee: 'Juan Guerra',
    dueDate: new Date('2026-12-15T12:00:00.000Z'),
  },
  {
    title: 'Optimizar índices en PostgreSQL',
    description: 'Evaluar planes de ejecución y añadir índices para status y assignee',
    status: TaskStatus.PENDING,
    assignee: null,
    dueDate: new Date('2026-12-18T12:00:00.000Z'),
  },
  {
    title: 'Configurar métricas con Prometheus',
    description: 'Exponer métricas de rendimiento y latencia HTTP para observabilidad',
    status: TaskStatus.PENDING,
    assignee: 'DevOps Team',
    dueDate: new Date('2026-12-20T12:00:00.000Z'),
  },
  {
    title: 'Implementar rate limiting',
    description: 'Proteger la API contra abusos mediante el módulo @nestjs/throttler',
    status: TaskStatus.PENDING,
    assignee: null,
    dueDate: new Date('2026-12-22T12:00:00.000Z'),
  },
  {
    title: 'Auditoría de seguridad de dependencias',
    description: 'Ejecutar escaneo de vulnerabilidades y actualizar paquetes críticos',
    status: TaskStatus.PENDING,
    assignee: 'Ana López',
    dueDate: new Date('2026-12-25T12:00:00.000Z'),
  },
  {
    title: 'Preparar despliegue a producción',
    description: 'Configurar Dockerfile multi-stage ligero para contenedor de producción',
    status: TaskStatus.PENDING,
    assignee: 'DevOps Team',
    dueDate: new Date('2026-12-30T12:00:00.000Z'),
  },
];

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar registros existentes para asegurar idempotencia
  await prisma.task.deleteMany();
  console.log('🧹 Base de datos limpiada.');

  // Insertar tareas
  const result = await prisma.task.createMany({
    data: seedTasks,
  });

  console.log(`✅ ${result.count} tareas sembradas con éxito.`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
