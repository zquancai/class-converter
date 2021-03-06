// eslint-disable-next-line max-classes-per-file
import { ImportMock } from 'ts-mock-imports';
import assert from 'assert';
import {
  property,
  optional,
  deserialize,
  beforeDeserialize,
  afterSerialize,
  serialize,
  typed,
  serializeTarget,
  defaultVal,
} from '../src/decorators';
import * as store from '../src/store';
import { StoreItemOptions, BasicClass } from '../src/typing';

const testDecorator = (tester: Function, expecter: (...args: any[]) => any) => {
  const mock = ImportMock.mockFunction(store, 'setStore').callsFake(expecter);
  tester();
  mock.restore();
};

class ChildModel {}
class TestModel {}

describe('decorators', () => {
  describe('property', () => {
    it('normal', () => {
      testDecorator(
        () => property('i')(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { originalKey: 'i', key: 'id' });
        },
      );
    });

    it('use class property key', () => {
      testDecorator(
        () => property()(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { originalKey: 'id', key: 'id' });
        },
      );
    });

    it('optional and targetClass', () => {
      testDecorator(
        () => property('c', ChildModel, true)(TestModel, 'child'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, {
            key: 'child',
            optional: true,
            originalKey: 'c',
            targetClass: ChildModel,
          });
        },
      );
    });
  });

  describe('deserialize', () => {
    it('normal', () => {
      const deserializer = () => '123';
      testDecorator(
        () => deserialize(deserializer)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { deserializer, key: 'id', disallowIgnoreDeserializer: false });
        },
      );
      testDecorator(
        () => deserialize(deserializer, true)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { deserializer, key: 'id', disallowIgnoreDeserializer: true });
        },
      );
    });
  });

  describe('optional', () => {
    it('normal', () => {
      testDecorator(
        () => optional()(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { optional: true, key: 'id' });
        },
      );
    });
  });

  describe('beforeDeserialize', () => {
    it('normal', () => {
      const beforeDeserializer = () => '123';
      testDecorator(
        () => beforeDeserialize(beforeDeserializer)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, {
            beforeDeserializer,
            key: 'id',
            disallowIgnoreBeforeDeserializer: false,
          });
        },
      );
      testDecorator(
        () => beforeDeserialize(beforeDeserializer, true)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, {
            beforeDeserializer,
            key: 'id',
            disallowIgnoreBeforeDeserializer: true,
          });
        },
      );
    });
  });

  describe('afterSerialize', () => {
    it('normal', () => {
      const afterSerializer = () => '123';
      testDecorator(
        () => afterSerialize(afterSerializer)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, {
            afterSerializer,
            key: 'id',
            disallowIgnoreAfterSerializer: false,
          });
        },
      );
      testDecorator(
        () => afterSerialize(afterSerializer, true)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { afterSerializer, key: 'id', disallowIgnoreAfterSerializer: true });
        },
      );
    });
  });

  describe('serialize', () => {
    it('normal', () => {
      const serializer = () => '123';
      testDecorator(
        () => serialize(serializer)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { serializer, key: 'id', disallowIgnoreSerializer: false });
        },
      );
      testDecorator(
        () => serialize(serializer, true)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { serializer, key: 'id', disallowIgnoreSerializer: true });
        },
      );
    });
  });

  describe('serializeTarget', () => {
    it('normal', () => {
      testDecorator(
        () => serializeTarget()(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { serializeTarget: true, key: 'id' });
        },
      );
    });
  });

  describe('typed', () => {
    it('normal', () => {
      testDecorator(
        () => typed(ChildModel)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { targetClass: ChildModel, key: 'id' });
        },
      );
    });
  });

  describe('defaultVal', () => {
    it('normal', () => {
      testDecorator(
        () => defaultVal(0)(TestModel, 'id'),
        (targetClass: BasicClass, storeItemOptions: StoreItemOptions) => {
          assert(targetClass === TestModel);
          assert.deepEqual(storeItemOptions, { default: 0, key: 'id' });
        },
      );
    });
  });
});
