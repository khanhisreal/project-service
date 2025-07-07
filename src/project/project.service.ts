/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/CreateProjectDto.dto';
import { JwtPayloadDTO } from './dto/JwtPayloadDTO.dto';
import { UpdateProjectDto } from './dto/UpdateProjectDTO.dto';
import {
  buildProjectFilter,
  DEFAULT_PAGE_SIZE,
  idIsValid,
} from 'src/utils/constants';
import { PaginationDto } from './dto/Pagination.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @Inject('PROJECT_EVENTS_BUS') private eventClient: ClientProxy,
  ) {}

  async createProject(createProjectDTO: CreateProjectDto, user: JwtPayloadDTO) {
    try {
      const projectConfig = {
        ...createProjectDTO,
        ownerId: user._id,
      };
      return await this.projectModel.create(projectConfig);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to create project.');
    }
  }

  async getProjects(paginationDto: PaginationDto, user: JwtPayloadDTO) {
    const {
      skip = 0,
      limit = DEFAULT_PAGE_SIZE,
      query,
      ownedBy,
    } = paginationDto;

    const filter = buildProjectFilter(query, ownedBy, user._id);

    const [projects, total] = await Promise.all([
      this.projectModel.find(filter).skip(skip).limit(limit).exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return { projects, total };
  }

  getTotalCount() {
    return this.projectModel.countDocuments();
  }

  async getProjectById(projectId: string) {
    if (!idIsValid(projectId)) {
      throw new HttpException('Invalid id', 400);
    }
    const projectDb = await this.projectModel
      .findOne({ _id: projectId })
      .exec();
    if (!projectDb) {
      throw new NotFoundException('Project not found');
    }
    return projectDb;
  }

  async updateProject(projectId: string, body: UpdateProjectDto) {
    if (!idIsValid(projectId)) {
      throw new HttpException('Invalid id', 400);
    }
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ _id: projectId }, { $set: body }, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    return updatedProject;
  }

  async deleteProject(projectId: string) {
    if (!idIsValid(projectId)) {
      throw new HttpException('Invalid id', 400);
    }
    const deletedProject = await this.projectModel.findOneAndDelete({
      _id: projectId,
    });
    if (!deletedProject) {
      throw new NotFoundException('Project not found');
    }

    //send event to Task service via RabbitMQ - doesn't care about the response
    this.eventClient.emit('project-deleted', { projectId });

    return { message: `Project ${deletedProject.title} deleted successfully` };
  }
}
