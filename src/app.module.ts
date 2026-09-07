import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditLog } from './database/entities/audit-log.entity';

// Organization domain
import { RoleModule } from './modules/organization/role/role.module';
import { UserModule } from './modules/organization/user/user.module';
import { DepartmentModule } from './modules/organization/department/department.module';
import { LocationModule } from './modules/organization/location/location.module';

// Sourcing domain
import { ManufacturerModule } from './modules/sourcing/manufacturer/manufacturer.module';
import { VendorModule } from './modules/sourcing/vendor/vendor.module';
import { CategoryModule } from './modules/sourcing/category/category.module';
import { ModelModule } from './modules/sourcing/model/model.module';
import { ItemTypeModule } from './modules/sourcing/item-type/item-type.module';

// Inventory domain

import { AssetModule } from './modules/inventory/asset/asset.module';

// Operations domain
import { AssetAssignmentModule } from './modules/operations/asset-assignment/asset-assignment.module';
import { MaintenanceLogModule } from './modules/operations/maintenance-log/maintenance-log.module';
import { AuditLogModule } from './modules/operations/audit-log/audit-log.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([AuditLog]),
    AuthModule,

    // Organization
    RoleModule,
    UserModule,
    DepartmentModule,
    LocationModule,

    // Sourcing
    ManufacturerModule,
    VendorModule,
    CategoryModule,
    ModelModule,
    ItemTypeModule,

    // Inventory

    AssetModule,

    // Operations
    AssetAssignmentModule,
    MaintenanceLogModule,
    AuditLogModule,

    // System
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}