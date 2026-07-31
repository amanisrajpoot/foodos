import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';

@Injectable()
export class WasteService {
  constructor(private readonly prisma: PrismaService) {}

  async logWaste(data: any) {
    return this.prisma.wasteEntry.create({ data });
  }
}
