// eslint-disable-next-line max-classes-per-file
import assert from 'assert';
import { property, deserialize, toClass, toClasses } from '../src';
import user from './fixtures/user.json';
import users from './fixtures/users.json';
import pkg from './fixtures/package.json';

abstract class AvatarModel {
  @deserialize((value: number) => value * 10)
  @property('i')
  id: number;

  @property('at')
  avatar: string;

  @deserialize((value: string) => `https://cdn.com/avatar/${value}.png`)
  @property('at')
  avatarUrl: string;
}

class UserModel extends AvatarModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property('e')
  email: string;
}

class PackageModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property('u', UserModel)
  creator: UserModel;
}

describe('toClass / toClasses', () => {
  it('should return UserModel instance', () => {
    const userModel = toClass(user, UserModel);
    assert(userModel instanceof UserModel);
    assert.deepEqual(userModel, {
      id: 123456,
      name: 'user-name',
      email: 'email@xx.com',
      avatar: '1a1b1b3b4c34d234',
      avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d234.png',
    });
  });

  it('should return array of UserModel instance', () => {
    const userModels = toClasses(users, UserModel);
    userModels.forEach(u => {
      assert(u instanceof UserModel);
    });
    assert.deepEqual(userModels, [
      {
        id: 123451,
        name: 'user-name1',
        email: 'email@xx.com1',
        avatar: '1a1b1b3b4c34d231',
        avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d231.png',
      },
      {
        id: 123452,
        name: 'user-name2',
        email: 'email@xx.com2',
        avatar: '1a1b1b3b4c34d232',
        avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d232.png',
      },
    ]);
  });

  it('should return PackageModel instance', () => {
    const packageModel = toClass(pkg, PackageModel);
    assert(packageModel instanceof PackageModel);
    assert(packageModel.creator instanceof UserModel);
    assert.deepEqual(packageModel, {
      id: 10000,
      name: 'name',
      creator: {
        id: 20000,
        name: 'name1',
        email: 'email1@xx.com',
        avatar: '1a1b1b3b4c34d234',
        avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d234.png',
      },
    });
  });
});
