/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { Roles } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateProjectDto } from './dto/CreateProjectDto.dto';
import { JwtPayloadDTO } from './dto/JwtPayloadDTO.dto';
import { UpdateProjectDto } from './dto/UpdateProjectDTO.dto';
import { PaginationDto } from './dto/Pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @RolesDecorator(Roles.MANAGER, Roles.LEADER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  createProject(@Body() createProjectDTO: CreateProjectDto, @Req() req: any) {
    const user: JwtPayloadDTO = req.user;
    return this.projectService.createProject(createProjectDTO, user);
  }

  @MessagePattern({ cmd: 'project-title' })
  async getTitle(@Payload() data: any) {
    const { projectId } = data;
    const project = await this.projectService.getProjectById(projectId);
    return project.title;
  }

  @RolesDecorator(Roles.MANAGER, Roles.LEADER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  getProjects(@Query() paginationDto: PaginationDto, @Req() req: any) {
    return this.projectService.getProjects(paginationDto, req.user);
  }

  @RolesDecorator(Roles.MANAGER, Roles.LEADER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/count')
  getTotalCount() {
    return this.projectService.getTotalCount();
  }

  @RolesDecorator(Roles.MANAGER, Roles.LEADER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') projectId: string) {
    return this.projectService.getProjectById(projectId);
  }

  @RolesDecorator(Roles.MANAGER, Roles.LEADER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProject(
    @Param('id') projectId: string,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(projectId, body);
  }

  @RolesDecorator(Roles.MANAGER, Roles.LEADER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProject(@Param('id') projectId: string) {
    return this.projectService.deleteProject(projectId);
  }
}
