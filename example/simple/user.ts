import { property, deserialize } from '../../src';
import UserEduModel from './edu';

export default class UserModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property('a')
  avatarUrl: Object;

  @property('a')
  avatar: boolean;

  @deserialize((value: any[]) => value[0].i)
  @property('io')
  icon: string;

  @property('t')
  createTime: string;

  @property('e', UserEduModel)
  edu: UserEduModel;

  @property('e', UserEduModel)
  edu1: UserEduModel;

  @property('e', UserEduModel)
  ed3: UserEduModel;

  @property('u', UserModel, true)
  user: UserModel;
}
