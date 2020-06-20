import { property, optional } from '../../src';
import { BaseModel } from './base';

export class DepartmentModel extends BaseModel<DepartmentModel> {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @optional()
  @property('sn')
  shortName?: string;
}
