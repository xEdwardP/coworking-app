import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  findMine(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { space: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: number, spaceId: number) {
    return this.prisma.favorite.upsert({
      where: { userId_spaceId: { userId, spaceId } },
      create: { userId, spaceId },
      update: {},
    });
  }

  async remove(userId: number, spaceId: number) {
    await this.prisma.favorite.deleteMany({ where: { userId, spaceId } });
    return { success: true };
  }
}