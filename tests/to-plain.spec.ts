// eslint-disable-next-line max-classes-per-file
import assert from 'assert';
import { property, deserialize, toPlain, toPlains, serialize, array } from '../src';
import user from './fixtures/user.json';
import users from './fixtures/users.json';
import pkg from './fixtures/pkg.json';
import department from './fixtures/department.json';

class AvatarModel {
  @property('at')
  avatar: string;

  @serialize((value: string) => String(value).replace(/https:\/\/cdn.com\/avatar\/([\d\w]+)\.png$/, '$1'))
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

class DepartmentModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @array()
  @property('e', UserModel)
  employees: UserModel[];
}

describe('toPlain / toPlains', () => {
  it('should return userRaw', () => {
    const userRaw = toPlain(
      {
        id: 123456,
        name: 'user-name',
        email: 'email@xx.com',
        avatar: '1a1b1b3b4c34d234',
        avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d234.png',
      },
      UserModel,
    );
    assert.deepEqual(userRaw, user);
  });

  it('should return array of userRaw', () => {
    const userRaws = toPlains(
      [
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
      ],
      UserModel,
    );
    assert.deepEqual(userRaws, users);
  });

  it('should return packageRaw', () => {
    const packageRaw = toPlain(
      {
        id: 10000,
        name: 'name',
        creator: {
          id: 20000,
          name: 'name1',
          email: 'email1@xx.com',
          avatar: '1a1b1b3b4c34d234',
          avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d234.png',
        },
      },
      PackageModel,
    );
    assert.deepEqual(packageRaw, pkg);
  });

  it('should return departmentRaw', () => {
    const departmentRaw = toPlain(
      {
        id: 10000,
        name: 'department',
        employees: [
          {
            id: 20001,
            name: 'name1',
            email: 'email1@xx.com',
            avatar: '1a1b1b3b4c34d231',
            avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d231.png',
          },
          {
            id: 20002,
            name: 'name2',
            email: 'email2@xx.com',
            avatar: '1a1b1b3b4c34d232',
            avatarUrl: 'https://cdn.com/avatar/1a1b1b3b4c34d232.png',
          },
        ],
      },
      DepartmentModel,
    );
    assert.deepEqual(department, departmentRaw);
  });
});
