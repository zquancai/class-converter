# class-converter

![](https://img.shields.io/badge/build-passing-brightgreen)
![](https://img.shields.io/badge/coverage-100%25-brightgreen)
![](https://img.shields.io/badge/license-MIT-green)

[English](README.md) | [简体中文](README-zh_CN.md)

`class-converter` 是一个用来将一个 json 转换成 class 的反序列化工具，并提供其逆过程。

这里是一个列子：

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

// 使用 toClass 将 json 转换成 class
const userModel = toClass(userRaw, UserModel);
// 你将获得如下数据
{
  id: 1234,
  name: 'name',
}
```

更多的示例请见[这里](example)

# 如何安装

```bash
npm i class-converter --save
```

# 更新
你可以在[这里](CHANGES-zh_CN.md)找到所有的 Breaking 更新


# 使用例子

## 聚合对象或数组

如果你想转换一个聚合对象，需要提供目标类。如果该对象的某个属性值是数组，则会递归该数组的所有元素（不管层级有多深），自动转换为目标类的实例。

列子：

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

## 其他数据类型转换

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

## 依赖于其他属性值

```ts
class EmailModel {
  @property('s')
  site: string;

  @property('e')
  @deserialize((value, _instance, origin) => `${value}@${origin.s}`)
  email: string;
}
```

# 方法

## toClass(raw, clazzType, options?) / toClasses(raws, clazzType, options?)

将一个 json 对象映射成一个类实例

- `raw` / `raws` `<Object|Array<Object>>` 一个 json 对象或者 json 对象数据
- `clazzType` `<Class>` 类的构造函数
- `options?` `<Object>` 配置
  - `ignoreDeserializer` `<Boolean>` 当设置为 true 时，不会调用使用 @deserialize 装饰器配置的方法
  - `ignoreBeforeDeserializer` `<Boolean>` 当设置为 true 时，不会调用使用 @beforeDeserialize 装饰器配置的方法
  - `distinguishNullAndUndefined` `<Boolean>` 当设置为 true 时，区分 null 和 undefined

示例：

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

将一个类实例或者 json 对象映射成另外一个 json 对象

- `instance` / `instances` `<Object|Array<Object>>` 一个 json 或类实例，或者一个json或类实例组成的数组
- `clazzType` `<Class>` Constructor of the target class
- `options?` `<Object>` 类的构造函数
  - `ignoreSerializer` `<Boolean>` 当设置为 true 时，不会调用使用 @serialize 装饰器配置的方法
  - `ignoreAfterSerializer` `<Boolean>` 当设置为 true 时，不会调用使用 @afterSerialize 装饰器配置的方法
  - `distinguishNullAndUndefined` `<Boolean>` 当设置为 true 时，区分 null 和 undefined

示例：

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

# 属性装饰器

调用不同的方法时，这些装饰器的执行顺序：

- `toClass/toClasses`: beforeDeserializer => typed(映射成一个类实例) => deserializer
- `toPlain/toPlains`: serializer => typed(映射成一个对象) => afterSerializer

## property(originalKey?, clazzType?, optional = false)

将一个 key 映射到另外一个 key，如 `n => name`

- `originalKey` `<string>` 被映射的数据 key， 如果不传则默认同名
- `clazzType` `<Class>` 自动将该属性的值映射到一个类实例，相当于调用了 `toClass` 方法
- `optional` `<Boolean>` 是否可选

示例：

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
// 你将获得如下数据
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

设置一个目标类的构造器，相当于 property 装饰器的第二个参数

- `clazzType` `<Class>` 自动将该属性的值映射到一个类实例，相当于调用了 `toClass` 方法

示例：

```ts
// 与此设置一致 @property('n', UserModel)
class TypedModel {
  @typed(UserModel)
  @property('u')
  user: UserModel;
}

const model = toClass({ u: { i: 123, n: 'name' } }, TypedModel);
// 你将获得如下数据
{
  user: {
    id: 123,
    name: 'name'
  }
}
```

## optional()

设置一个属性为可选，相当于 property 装饰器的第三个参数

示例：

```ts
// 与此设置一致 @property('n', null, true)
class OptionalModel {
  @optional()
  @property('n')
  name: string;
}

const model = toClass({}, OptionalModel);
// 你将获得如下数据
{
}

const model = toClass({ n: 'name' }, OptionalModel);
// 你将获得如下数据
{
  name: 'name';
}
```

## defaultVal(val)

给当前属性设置默认值

- `val` `<Any>` 要设置的默认值

示例：

```ts
class DefaultValModel {
  @defaultVal(0)
  @property('i')
  id: number;
}

const model = toClass({}, DefaultValModel);
// 你将获得如下数据
{
  id: 0;
}

const raw = toPLain({}, DefaultValModel);
// 你将获得如下数据
{
  i: 0;
}
```

## serializeTarget()

当调 `toPlain` 进行序列化时，用使用当前数据作为基准

示例：

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

// 你将获得如下数据
{
  n: 'name';
}
```

## beforeDeserialize(beforeDeserializer, disallowIgnoreBeforeDeserializer = false)

在 `@typed` 调用之前调用

- `beforeDeserializer` `<(value: any, instance: any, origin: any) => any>`
  - `value` `<Any>` 该属性在原始对象中的值
  - `instance` `<Instance>` 类实例（未完成解析）
  - `origin` `<Object>` 原始对象
- `disallowIgnoreBeforeDeserializer` `<Boolean>` 默认为 false，如果设置为 true，则当调用 `toClass` 时，将强制调用 `@beforeDeserialize` 配置的方法

示例：

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

// 你将获得如下数据
{
  mail: { id: 123 },
};
```

## deserialize(deserializer, disallowIgnoreDeserializer =false)

将原始对象序列化成自定义的数组格式，仅在调用  `toClass/toClasses` 时可用

- `deserializer` `(value: any, instance: any, origin: any) => any`
  - `value` `<Any>` 该属性的值经过 `@beforeDeserialize` 和 `@typed` 调用后的结果
  - `instance` `<Instance>` 类实例（未完成解析）
  - `origin` `<Object>` A raw object
- `disallowIgnoreDeserializer` `<Boolean>` 默认为 false，如果设置为 true，则当调用 `toClass` 时，将强制调用 `@deserialize` 配置的方法

示例：

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

// 你将获得如下数据
{
  mail: 'mail@xxx.com',
};
```

## serialize(serializer, disallowIgnoreSerializer = false)

自定义属性值的序列化方式，仅当调用 `toPlain/toPlains` 时可用

- `serializer` `(value: any, instance: any, origin: any) => any`
  - `value` `<Any>` 该属性在类实例中的值
  - `instance` `<Instance>` 当前类实例
  - `origin` `<Object>` 一个json对象（未完成序列化）
- `disallowIgnoreSerializer` `<Boolean>` 默认为 false，如果设置为 true，则当调用 `toClass` 时，将强制调用 `@serialize` 配置的方法

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

// 你将获得如下数据
{
  e: 'mail@xxx.com',
}
```

## afterSerialize(afterSerializer, disallowIgnoreAfterSerializer = false)

Convert a key/value in instance to a target form data, it happened after serializer only

- `afterSerializer` `(value: any, instance: any, origin: any) => any`
  - `value` `<Any>` 该属性的值经过 `@serializer` 和 `@typed` 调用后的结果
  - `instance` `<Instance>` 当前类实例
  - `origin` `<Object>` 一个json对象（未完成序列化）
- `disallowIgnoreAfterSerializer` `<Boolean>` 默认为 false，如果设置为 true，则当调用 `toClass` 时，将强制调用 `@afterSerialize` 配置的方法

示例：

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

// 你将获得如下数据
{
  e: '{"id":1000}',
};
```

# 测试

```bash
npm run test
```

# 许可证

[MIT](LICENSE.md)
