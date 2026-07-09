import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('spaces/:spaceId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Param('spaceId', ParseIntPipe) spaceId: number) {
    return this.reviewsService.findBySpace(spaceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Req() req: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(spaceId, req.user.userId, dto);
  }
}