# class-converter

![](https://img.shields.io/badge/build-passing-brightgreen)
![](https://img.shields.io/badge/coverage-100%25-brightgreen)
![](https://img.shields.io/badge/license-MIT-green)

[English](README.md) | [简体中文](README-zh_CN.md)

`class-converter` is used to convert a plain object to a class instance and the reverse process.

There is a simple example:

```ts
import { property, toClass } from 'class-convert';

class UserModel {
  @property('i')
  id: number;

  @property()
  name: string;
}

const userRaw = {
  i: 1234,
  name: 'name',
};

// use toClass to convert plain object to class
const userModel = toClass(userRaw, UserModel);
// you will get a class, just like below one
{
  id: 1234,
  name: 'name',
}
```

you can see a more complex example [here](example)

# Installation

```bash
npm i class-converter --save
```

# Changes
You can click [here](CHANGES.md) to find the details of breaking changes.

# Usage Examples

## Work with nested object/array

If you try to convert objects that have nested objects/arrays, you need to provide the type of object. If the value of the property of your object is an array, it will be converted all items in that array to target type automatically.

Example:

```ts
class NestedModel {
  @property('e', UserModel)
  employees: UserModel[];

  @typed(UserModel)
  @property('u')
  user: UserModel;
}

const model = toClass(
  {
    e: [
      { i: 1, n: 'n1' },
      { i: 2, n: 'n2' },
    ],
    u: {
      i: 1,
      n: 'name',
    }
  },
  NestedModel,
);
// you will get like this
{
  employees: [
    { id: 1, name: 'n1' },
    { id: 2, name: 'n2' },
  ],
  user: {
    id: 1,
    name: 'name'
  }
}

const model = toPlain(
  {
    employees: [
      { id: 1, name: 'n1' },
      { id: 2, name: 'n2' },
    ],
    user: {
      id: 1,
      name: 'name'
    }
  },
  NestedModel,
);
// you will get like this
{
  e: [
    { i: 1, n: 'n1' },
    { i: 2, n: 'n2' },
  ],
  u: {
    i: 1,
    n: 'name'
  }
}
```

## Additional data conversion

```ts
import * as moment from 'moment';

export class EduModel {
  @property('i')
  id: number;

  @property('crt')
  @deserialize(value => moment(value).format('YYYY-MM-DD HH:mm:ss'))
  createTime: string;
}
```

## Require for other properties

```ts
class EmailModel {
  @property('s')
  site: string;

  @property('e')
  @deserialize((value, _instance, origin) => `${value}@${origin.s}`)
  email: string;
}
```

# Methods

## toClass(raw, clazzType, options?) / toClasses(raws, clazzType, options?)

Convert an object to a class instance

- `raw` / `raws` `<Object|Array<Object>>` An raw `object` or an array of raw `object`
- `clazzType` `<Class>` Constructor of the target class
- `options?` `<Object>` convert config
  - `ignoreDeserializer` `<Boolean>` don't call deserializer(@deserialize) if true
  - `ignoreBeforeDeserializer` `<Boolean>` don't call beforeDeserializer(@beforeDeserialize) if true
  - `distinguishNullAndUndefined` `<Boolean>` distinguish null and undefined if true

Example:

```ts
const userRaw = {
  i: 1234,
  name: 'name',
};
const userRaws = [
  {
    i: 1000,
    name: 'name1',
  },
  {
    i: 2000,
    name: 'name2',
  },
];
const userModel = toClass(userRaw, UserModel);
const userModels = toClasses(userRaws, UserModel);
```

## toPlain(instance, clazzType, options?) / toPlains(instances, clazzType, options?)

convert an object or a class instance to a raw object

- `instance` / `instances` `<Object|Array<Object>>` An `object|instance` or array of `object|instance`
- `clazzType` `<Class>` Constructor of the target class
- `options?` `<Object>` convert config
  - `ignoreSerializer` `<Boolean>` don't call serializer(@serialize) if true
  - `ignoreAfterSerializer` `<Boolean>` don't call afterSerializer(@afterSerialize) if true
  - `distinguishNullAndUndefined` `<Boolean>` distinguish null and undefined if true

Example:

```ts
const userModel = {
  id: 1234,
  name: 'name',
};
const userModels = [
  {
    id: 1000,
    name: 'name1',
  },
  {
    id: 2000,
    name: 'name2',
  },
];
const userRaw = toPlain(userModel, UserModel);
const userRaws = toPlains(userModels, UserModel);
```




# All Property Decorators

The order in which these decorator's are invoked during the transformation:

- `toClass/toClasses`: beforeDeserializer => typed(convert to an instance) => deserializer
- `toPlain/toPlains`: serializer => typed(convert to a object) => afterSerializer

## property(originalKey?, clazzType?, optional = false)

Convert a original key to your customized key, like `n => name`

- `originalKey` `<string>` A key of a raw object, default current class key
- `clazzType` `<Class>` Constructor its value to a target class instance automatically
- `optional` `<Boolean>` Optional in a raw object

Example:

```ts
class PropertyModel {
  @property('i')
  id: number;

  @property()
  name: string;

  @property('u', UserModel)
  user: UserModel;

  @property('t', null, true)
  timeStamp: number;
}

const model = toClass({ i: 234, name: 'property', u: { i: 123, n: 'name' } }, PropertyModel);
// you will get like this
{
  id: 234,
  name: 'property',
  user: {
    id: 123,
    name: 'name'
  }
}
```

## typed(clazzType)

Set a target class type to a property, as same as the second parameter of property decorator

- `clazzType` `<Class>` Constructor its value to a target class instance automatically

Example:

```ts
// as same as @property('n', UserModel)
class TypedModel {
  @typed(UserModel)
  @property('u')
  user: UserModel;
}

const model = toClass({ u: { i: 123, n: 'name' } }, TypedModel);
// you will get like this
{
  user: {
    id: 123,
    name: 'name'
  }
}
```

## optional()

Set a optional setting to a property, as same as the third parameter of property decorator

Example:

```ts
// as same as @property('n', null, true)
class OptionalModel {
  @optional()
  @property('n')
  name: string;
}

const model = toClass({}, OptionalModel);
// you will get like this
{
}

const model = toClass({ n: 'name' }, OptionalModel);
// you will get like this
{
  name: 'name';
}

const model = toClass(
  {
    e: [
      { i: 1, n: 'n1' },
      { i: 2, n: 'n2' },
    ],
  },
  OptionalModel,
);
// you will get like this
{
  employees: [
    { id: 1, name: 'n1' },
    { id: 2, name: 'n2' },
  ],
}

const model = toPlain(
  {
    employees: [
      { id: 1, name: 'n1' },
      { id: 2, name: 'n2' },
    ],
  },
  OptionalModel,
);
// you will get like this
{
  e: [
    { i: 1, n: 'n1' },
    { i: 2, n: 'n2' },
  ],
}
```

## defaultVal(val)

set a default value to current property

- `val` `<Any>` default value

Example:

```ts
class DefaultValModel {
  @defaultVal(0)
  @property('i')
  id: number;
}

const model = toClass({}, DefaultValModel);
// you will get like this
{
  id: 0;
}

const raw = toPLain({}, DefaultValModel);
// you will get like this
{
  i: 0;
}
```

## serializeTarget()

use the value of the current property when call `toPlain` function.

Example:

```ts
class SerializeTargetModel {
  @serializeTarget()
  @property('n')
  name: string;

  @property('n')
  nick: string;
}

const raw = toPlain(
  {
    name: 'name',
    nick: 'nick',
  },
  SerializeTargetModel,
);

// you will get like this
{
  n: 'name';
}
```

## beforeDeserialize(beforeDeserializer, disallowIgnoreBeforeDeserializer = false)

Convert original value to a target form data, it happened before deserializer

- `beforeDeserializer` `<(value: any, instance: any, origin: any) => any>`
  - `value` `<Any>` The value corresponding to the current key in a raw object
  - `instance` `<Instance>` An instance(half-baked) of current class
  - `origin` `<Object>` A raw object
- `disallowIgnoreBeforeDeserializer` `<Boolean>` Force call beforeDeserializer(@beforeDeserialize) when call `toClass` if true, default false

Example:

```ts
class BeforeDeserializeModel {
  @beforeDeserialize((value: any) => JSON.parse(value))
  @property('m')
  mail: object;
}

toClass(
  {
    m: '{"id":123}',
  },
  BeforeDeserializeModel,
);

// you will get like this
{
  mail: { id: 123 },
};
```

## deserialize(deserializer, disallowIgnoreDeserializer =false)

Deserialize original value to customized data, it only support when use `toClass/toClasses`

- `deserializer` `(value: any, instance: any, origin: any) => any`
  - `value` `<Any>` The value(result of beforeDeserializer/typed) corresponding to the current key in a raw object
  - `instance` `<Instance>` An instance(half-baked) of current class
  - `origin` `<Object>` A raw object
- `disallowIgnoreDeserializer` `<Boolean>` Force call deserializer(@deserialize) when call `toClass` if true, default false

Example:

```ts
class DeserializeModel {
  @deserialize((value: string) => `${value}@xxx.com`)
  @property('m')
  mail: string;
}

toClass(
  {
    m: 'mail',
  },
  DeserializeModel,
);

// you will get like this
{
  mail: 'mail@xxx.com',
};
```

## serialize(serializer, disallowIgnoreSerializer = false)

Serialize customized value to original value, it only support when use `toPlain/toPlains`

- `serializer` `(value: any, instance: any, origin: any) => any`
  - `value` `<Any>` The value corresponding to the current key in a instance
  - `instance` `<Instance>` An instance of current class
  - `origin` `<Object>` A raw object(half-baked)
- `disallowIgnoreSerializer` `<Boolean>` Force call serializer(@serialize) when call `toPlain` if true, default false

Example:

```ts
class SerializeModel {
  @serialize((mail: string) => mail.replace('@xxx.com', ''))
  @property('e')
  mail: string;
}

toPlain(
  {
    mail: 'mail@xxx.com',
  },
  SerializeModel,
);

// you will get like this
{
  e: 'mail@xxx.com',
}
```

## afterSerialize(afterSerializer, disallowIgnoreAfterSerializer = false)

Convert a key/value in instance to a target form data, it happened after serializer only

- `afterSerializer` `(value: any, instance: any, origin: any) => any`
  - `value` `<Any>` The value(result of serializer/typed) corresponding to the current key in a instance
  - `instance` `<Instance>` An instance of current class
  - `origin` `<Object>` A raw object(half-baked)
- `disallowIgnoreAfterSerializer` `<Boolean>` Force call afterSerializer(@afterSerialize) when call `toPlain` if true, default false

Example:

```ts
class AfterSerializeModel {
  @afterSerialize((mail: string) => JSON.stringify(mail))
  @property('e')
  mail: string;
}

toPlain(
  {
    mail: { id: 1000 },
  },
  SerializeModel,
);

// you will get like this
{
  e: '{"id":1000}',
};
```

# Tests

```bash
npm run test
```

# License

[MIT](LICENSE.md)
