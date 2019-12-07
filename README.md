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

# get start

## For browser

```bash
npm install class-converter --save
```

# Methods

#### toClass(raw: any | any[], clazzType)
convert a plain object to class
```js
const userModel = toClass(userRaw, UserModel);
```

#### property(key: string, clazzType?: any, optional = false)
```js
import { property, deserialize } from 'class-converter';
import moment from 'moment';

export default class UserEduModel {
  @property('i')
  id: number;

  @property('n')
  name: string;
}

export default class UserModel {
  @property('i')
  id: number;

  @property('n')
  name: string;

  @property('a', null, false)
  avatarUrl: string;

  @property('e', UserEduModel)
  edu: UserEduModel;
}

```

#### deserialize(deserializer: (value: any, instance: any, origin: any) => any
```js
import { property, deserialize } from 'class-converter';

export default class UserModel {
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
  mail: 'name@xxx.com'
};

```
