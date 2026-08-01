import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { IngredientsService } from '../services/ingredients.service';

@Controller('inventory/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  async findAll(@Headers('x-organization-id') organizationId: string) {
    return this.ingredientsService.findAll(organizationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Post()
  async create(
    @Body() data: any,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.ingredientsService.create({ ...data, organizationId });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.ingredientsService.update(id, data);
  }
}
