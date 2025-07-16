import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => await getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    SubscriptionPlansModule,
    TenantsModule
  ],
})
export class AppModule {}
