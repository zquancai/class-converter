import { property, deserialize } from '../../src';
import moment from 'moment';

export default class UserEduModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @deserialize((value: number) => moment(value).format('YYYY-MM-DD HH:mm:ss'))
  @property('t')
  time: string;
}
