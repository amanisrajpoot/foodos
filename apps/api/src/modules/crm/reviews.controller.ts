import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('customers/:customerId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Param('customerId') customerId: string,
    @Body() data: any,
  ) {
    return this.reviewsService.createReview({ ...data, customerId });
  }

  @Get()
  async getReviews(
    @Param('customerId') customerId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.reviewsService.getCustomerReviews(customerId, organizationId);
  }

  @Patch(':id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
    @Body('status') status: string,
  ) {
    return this.reviewsService.moderateReview(id, organizationId, status);
  }
}
