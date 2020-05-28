import { property } from '../src';
import { BaseModel } from './base';

export class EducationModel extends BaseModel<EducationModel> {
  @property('i')
  id: number;

  @property('sn')
  schoolName: string;
}
