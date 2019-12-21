# class-converter

class-converter is used to convert a plain object to a class.
There is a simple example:

```js
class UserModel {
  @property('i')
  id: number;

  @property('n')
  name: string;
}

const userRaw = {
  i: 1234,
  n: 'name',
};

// use toClass to convert plain object to class
const userModel = toClass(userRaw, UserModel);
// you will get a class, just like below one
// const userModel = {
//   id: 1234,
//   name: 'name',
// }
```

# Installation

```bash
npm install class-converter npm install --save
```

# Methods

### toClass(raw: { [key: stirng]: any }, clazzType: ClassType) / toClasses(raw: { [key: stirng]: any }[], clazzType: ClassType)

convert a plain object to class

```js
const userModel = toClass(userRaw, UserModel);
const userModels = toClasses(userRaws, UserModel);
```

### toPlain(instance: ClassType | { [key: stirng]: any }, clazzType: ClassType) / toPlains(instances: ClassType | { [key: stirng]: any }[], clazzType: ClassType)

convert a plain/class object to rawPlain

```js
const userRaw = toClass(userModel, UserModel);
const userRaws = toClasses(userModels, UserModel);
```

### property(key: string, clazzType?: any, optional = false)

```js
import { property, deserialize } from 'class-converter';
import moment from 'moment';

class UserEduModel {
  @property('i')
  id: number;

  @property('n')
  name: string;
}

class UserModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property('a', null, false)
  avatarUrl: string;

  @property('e', UserEduModel)
  edu: UserEduModel;
}

export class AdminUserModel extends UserModel {
  @property('r')
  role: number;
}
```

### array(dimension?: 1 | 2)

- [optional]dimension dimension of the array, default 1

```js
import { property, deserialize, array } from 'class-converter';
import moment from 'moment';

class UserModel {
  @property('i')
  id: number;

  @property('n')
  name: string;
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
```

### deserialize(deserializer: (value: any, instance: any, origin: any) => any

```js
import { property, deserialize } from 'class-converter';

class UserModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @deserialize((value: string) => `${value}@xxx.com`)
  @property('n')
  mail: string;
}

// you will get like this
const user = {
  id: 1234,
  name: 'name',
  mail: 'name@xxx.com',
};
```
