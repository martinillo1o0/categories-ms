import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module.js';


@Module({
imports: [ConfigModule.forRoot({ isGlobal: true }), CategoryModule],


})
export class AppModule {}
