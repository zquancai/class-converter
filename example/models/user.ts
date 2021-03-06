import { property, typed } from '../../src';
import { AvatarModel } from './avatar';
import { DepartmentModel } from './department';
import { EducationModel } from './education';

export class UserModel extends AvatarModel<UserModel> {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property()
  email: string;

  @typed(DepartmentModel)
  @property('d')
  department: DepartmentModel;

  @typed(EducationModel)
  @property('edu')
  educations: EducationModel[];
}
