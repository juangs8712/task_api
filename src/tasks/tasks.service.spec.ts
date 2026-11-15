import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn<() => Promise<any>>(),
      findMany: jest.fn<() => Promise<any>>(),
      count: jest.fn<() => Promise<any>>(),
      findUnique: jest.fn<() => Promise<any>>(),
      update: jest.fn<() => Promise<any>>(),
    },
    $transaction: jest.fn<() => Promise<any>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  // Test 1: Creación de tarea exitosa
  it('should create a task successfully calling prisma.task.create', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Nueva Tarea',
      description: 'Descripción de prueba',
      status: TaskStatus.PENDING,
      assignee: 'Juan',
      dueDate: '2026-12-01T00:00:00.000Z',
    };

    const expectedTask = {
      id: 'uuid-123',
      ...createTaskDto,
      dueDate: new Date(createTaskDto.dueDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.task.create.mockResolvedValue(expectedTask);

    const result = await service.create(createTaskDto);

    expect(mockPrismaService.task.create).toHaveBeenCalledWith({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        assignee: createTaskDto.assignee,
        dueDate: new Date(createTaskDto.dueDate),
      },
    });
    expect(result).toEqual(expectedTask);
  });

  // Test 2: Paginación y estructura de respuesta { data, meta }
  it('should return paginated tasks with data and meta', async () => {
    const mockTasks = [
      {
        id: 'uuid-1',
        title: 'Tarea 1',
        description: null,
        status: TaskStatus.PENDING,
        assignee: 'Juan',
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const total = 1;

    mockPrismaService.$transaction.mockResolvedValue([total, mockTasks]);

    const filterDto = { page: 1, limit: 10 };
    const result = await service.findAll(filterDto);

    expect(mockPrismaService.$transaction).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockTasks,
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  // Test 3: Excepción NotFoundException al actualizar ID inexistente
  it('should throw NotFoundException when updating a non-existent task', async () => {
    const nonExistentId = 'non-existent-uuid';
    const updateTaskDto: UpdateTaskDto = { title: 'Nuevo Título' };

    mockPrismaService.task.findUnique.mockResolvedValue(null);

    await expect(service.update(nonExistentId, updateTaskDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
      where: { id: nonExistentId },
    });
    expect(mockPrismaService.task.update).not.toHaveBeenCalled();
  });
});
