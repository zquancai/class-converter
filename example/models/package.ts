// eslint-disable-next-line max-classes-per-file
import { property } from '../../src';
import { UserModel } from './user';
import { BaseModel } from './base';

export class PackageModel<T> extends BaseModel<T & PackageModel<T>> {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property('u', UserModel)
  creator: UserModel;
}
