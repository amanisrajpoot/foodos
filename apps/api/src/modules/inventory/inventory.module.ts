import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { IngredientsService } from './services/ingredients.service';
import { StockService } from './services/stock.service';
import { SuppliersService } from './services/suppliers.service';
import { PurchaseOrdersService } from './services/purchase-orders.service';
import { RecipeLinesService } from './services/recipe-lines.service';
import { WasteService } from './services/waste.service';
import { AlertsService } from './services/alerts.service';

import { IngredientsController } from './controllers/ingredients.controller';
import { StockController } from './controllers/stock.controller';
import { SuppliersController } from './controllers/suppliers.controller';
import { PurchaseOrdersController } from './controllers/purchase-orders.controller';
import { WasteController } from './controllers/waste.controller';
import { AlertsController } from './controllers/alerts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    IngredientsController,
    StockController,
    SuppliersController,
    PurchaseOrdersController,
    WasteController,
    AlertsController,
  ],
  providers: [
    IngredientsService,
    StockService,
    SuppliersService,
    PurchaseOrdersService,
    RecipeLinesService,
    WasteService,
    AlertsService,
  ],
  exports: [
    IngredientsService,
    StockService,
    SuppliersService,
    PurchaseOrdersService,
    RecipeLinesService,
    WasteService,
    AlertsService,
  ],
})
export class InventoryModule {}
