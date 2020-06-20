import { property, deserialize, serializeTarget } from '../../src';
import { BaseModel } from './base';

export class AvatarModel<T = any> extends BaseModel<T & AvatarModel<T>> {
  @deserialize((value: string) => Number(value))
  @property('i')
  id: number;

  @serializeTarget()
  @property('at')
  avatar: string;

  @deserialize((value: string) => `https://cdn.com/avatar/${value}.png`)
  @property('at')
  avatarUrl: string;
}
