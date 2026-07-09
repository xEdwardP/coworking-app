import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  }),
});

const password = 'password123';

const spaces = [
  {
    name: 'Sala Ada Lovelace',
    description:
      'Sala cerrada con ventanal, ideal para reuniones de equipo o sesiones de trabajo enfocado. Incluye pizarra blanca y conexion para videollamadas.',
    location: 'Piso 2 - Ala Norte',
    capacity: 6,
    type: 'SALA',
    status: true,
  },
  {
    name: 'Sala Alan Turing',
    description: 'Sala compacta para reuniones rapidas, entrevistas y sesiones de planificacion.',
    location: 'Piso 2 - Ala Sur',
    capacity: 8,
    type: 'SALA',
    status: true,
  },
  {
    name: 'Escritorio Grace Hopper',
    description: 'Puesto individual en terraza con buena luz natural y conexion electrica cercana.',
    location: 'Piso 3 - Terraza',
    capacity: 1,
    type: 'ESCRITORIO',
    status: true,
  },
  {
    name: 'Escritorio Margaret Wu',
    description: 'Escritorio individual silencioso para trabajo concentrado durante el dia.',
    location: 'Piso 3 - Terraza',
    capacity: 1,
    type: 'ESCRITORIO',
    status: true,
  },
  {
    name: 'Auditorio Margaret Hamilton',
    description: 'Auditorio equipado para charlas, presentaciones y talleres con grupos medianos.',
    location: 'Piso 1 - Ala Sur',
    capacity: 40,
    type: 'AUDITORIO',
    status: true,
  },
  {
    name: 'Sala Katherine Johnson',
    description: 'Sala luminosa para equipos pequenos, con pantalla y cafe de cortesia.',
    location: 'Piso 2 - Ala Norte',
    capacity: 4,
    type: 'SALA',
    status: true,
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await prisma.user.upsert({
    where: { email: 'user1@test.com' },
    update: {
      name: 'Estudiante Uno',
      password: hashedPassword,
      role: 'USER',
      status: true,
    },
    create: {
      name: 'Estudiante Uno',
      email: 'user1@test.com',
      password: hashedPassword,
      role: 'USER',
      status: true,
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: 'maria@test.com' },
    update: {
      name: 'Maria Gonzalez',
      password: hashedPassword,
      role: 'USER',
      status: true,
    },
    create: {
      name: 'Maria Gonzalez',
      email: 'maria@test.com',
      password: hashedPassword,
      role: 'USER',
      status: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      name: 'Admin Nido',
      password: hashedPassword,
      role: 'ADMIN',
      status: true,
    },
    create: {
      name: 'Admin Nido',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: true,
    },
  });

  const savedSpaces: Array<{ id: number; name: string }> = [];
  for (const space of spaces) {
    const existing = await prisma.space.findFirst({ where: { name: space.name } });
    const saved = existing
      ? await prisma.space.update({
          where: { id: existing.id },
          data: space,
        })
      : await prisma.space.create({ data: space });
    savedSpaces.push(saved);
  }

  const byName = new Map(savedSpaces.map((space) => [space.name, space]));
  const ada = byName.get('Sala Ada Lovelace')!;
  const alan = byName.get('Sala Alan Turing')!;
  const grace = byName.get('Escritorio Grace Hopper')!;
  const auditorio = byName.get('Auditorio Margaret Hamilton')!;

  await prisma.reservation.deleteMany({
    where: {
      OR: [
        { userId: { in: [student.id, maria.id, admin.id] } },
        { spaceId: { in: savedSpaces.map((space) => space.id) } },
      ],
    },
  });
  await prisma.review.deleteMany({
    where: {
      OR: [
        { userId: { in: [student.id, maria.id, admin.id] } },
        { spaceId: { in: savedSpaces.map((space) => space.id) } },
      ],
    },
  });
  await prisma.favorite.deleteMany({
    where: {
      OR: [
        { userId: { in: [student.id, maria.id, admin.id] } },
        { spaceId: { in: savedSpaces.map((space) => space.id) } },
      ],
    },
  });

  await prisma.favorite.createMany({
    data: [
      { userId: student.id, spaceId: ada.id },
      { userId: student.id, spaceId: grace.id },
      { userId: maria.id, spaceId: auditorio.id },
    ],
  });

  await prisma.reservation.createMany({
    data: [
      {
        userId: student.id,
        spaceId: ada.id,
        startTime: new Date('2026-08-10T11:00:00.000Z'),
        endTime: new Date('2026-08-10T12:00:00.000Z'),
        status: 'PENDING',
      },
      {
        userId: student.id,
        spaceId: ada.id,
        startTime: new Date('2026-08-10T15:00:00.000Z'),
        endTime: new Date('2026-08-10T16:00:00.000Z'),
        status: 'PENDING',
      },
      {
        userId: student.id,
        spaceId: auditorio.id,
        startTime: new Date('2026-08-05T15:00:00.000Z'),
        endTime: new Date('2026-08-05T16:00:00.000Z'),
        status: 'CONFIRMED',
      },
      {
        userId: student.id,
        spaceId: grace.id,
        startTime: new Date('2026-06-28T09:00:00.000Z'),
        endTime: new Date('2026-06-28T13:00:00.000Z'),
        status: 'CONFIRMED',
      },
      {
        userId: student.id,
        spaceId: alan.id,
        startTime: new Date('2026-08-03T10:00:00.000Z'),
        endTime: new Date('2026-08-03T11:00:00.000Z'),
        status: 'CANCELLED',
        reason: 'Cancelada por el usuario',
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        userId: maria.id,
        spaceId: ada.id,
        rating: 5,
        comment:
          'Excelente para trabajo en equipo, la pizarra y el proyector funcionaron perfecto. Volveriamos a reservarla.',
      },
      {
        userId: student.id,
        spaceId: grace.id,
        rating: 5,
        comment: 'Muy comodo para concentrarse y con buen acceso a tomas de corriente.',
      },
      {
        userId: admin.id,
        spaceId: auditorio.id,
        rating: 4,
        comment: 'Buen espacio para presentaciones y talleres.',
      },
    ],
  });

  console.log('Seed completado.');
  console.log(`Usuario: user1@test.com / ${password}`);
  console.log(`Admin: admin@test.com / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
