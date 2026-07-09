import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySpace(spaceId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { spaceId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const average = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return { items: reviews, total: reviews.length, average };
  }

  async create(spaceId: number, userId: number, dto: CreateReviewDto) {
    const eligible = await this.prisma.reservation.findFirst({
      where: {
        spaceId,
        userId,
        status: 'CONFIRMED',
        endTime: { lt: new Date() },
      },
    });
    if (!eligible) {
      throw new BadRequestException(
        'Solo puedes reseñar espacios donde ya tuviste una reserva confirmada y finalizada',
      );
    }

    const existing = await this.prisma.review.findUnique({
      where: { userId_spaceId: { userId, spaceId } },
    });
    if (existing) {
      throw new ConflictException('Ya dejaste una reseña para este espacio');
    }

    return this.prisma.review.create({
      data: { spaceId, userId, rating: dto.rating, comment: dto.comment },
    });
  }
}