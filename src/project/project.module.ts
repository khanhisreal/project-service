import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'PROJECT_EVENTS_BUS', //internal token for dependency injection
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'project_events_queue', //queue name that we produce messages to
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, JwtStrategy],
})
export class ProjectModule {}
