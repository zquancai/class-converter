import { toClass } from '../../src';
import UserModel from './user';
import userJson from './user.json';

const json = userJson;
console.log(toClass<UserModel>(json, UserModel));
