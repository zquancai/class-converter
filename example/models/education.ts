import { property, optional, defaultVal } from '../../src';
import { BaseModel } from './base';

export class EducationModel extends BaseModel<EducationModel> {
  @optional()
  @property('i')
  id: number;

  @defaultVal('')
  @property('sn')
  schoolName: string;
}
