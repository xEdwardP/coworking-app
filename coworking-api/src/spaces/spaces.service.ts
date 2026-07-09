import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSpaceDto) {
    return this.prisma.space.create({ data: dto });
  }

  findAll() {
    return this.prisma.space.findMany({ where: { status: true } });
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) throw new NotFoundException('Espacio no encontrado');
    return space;
  }

  async update(id: number, dto: UpdateSpaceDto) {
    await this.findOne(id);
    return this.prisma.space.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.space.update({ where: { id }, data: { status: false } });
  }

  async getAvailability(spaceId: number, date: string) {
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        spaceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: { gte: dayStart, lte: dayEnd },
      },
      select: { startTime: true, endTime: true },
    });

    return reservations;
  }
}
