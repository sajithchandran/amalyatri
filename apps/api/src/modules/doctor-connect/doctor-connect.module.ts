import { Module } from '@nestjs/common';
import { DoctorConnectController } from './doctor-connect.controller';
import { DoctorConnectService } from './doctor-connect.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DoctorConnectController],
  providers: [DoctorConnectService],
  exports: [DoctorConnectService],
})
export class DoctorConnectModule {}
