import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Injecting User entity
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService if needed in other modules
})
export class UsersModule {}
