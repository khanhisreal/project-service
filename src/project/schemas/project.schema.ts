import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({
  timestamps: true,
})
export class Project {
  @Prop({ required: true, minlength: 3, maxlength: 100 })
  title: string;

  @Prop({ maxlength: 500 })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
