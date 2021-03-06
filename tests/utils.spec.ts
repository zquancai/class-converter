// eslint-disable-next-line max-classes-per-file
import assert from 'assert';
import { mockStore, mockOriginalKeyStores, mockKeyStores } from './fixtures';
import { getOriginalKeyStore, getKeyStore, isNull, isNullOrUndefined, isUndefined } from '../src/utils';

describe('utils', () => {
  describe('null & undefined', () => {
    it('isNull', () => {
      assert(isNull(null));
    });

    it('isUndefined', () => {
      assert(isUndefined(undefined));
    });

    it('isNullOrUndefined', () => {
      assert(isNullOrUndefined(undefined));
      assert(isNullOrUndefined(null));
    });
  });

  describe('getOriginalKeyStore', () => {
    it('normal', () => {
      class BaseModel {}

      class TestModel extends BaseModel {}
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'name',
              item: {
                originalKey: 'n',
              },
            },
            {
              key: 'nickName',
              item: {
                originalKey: 'n',
              },
            },
          ],
        },
        {
          clazz: BaseModel,
          storeItems: [
            {
              key: 'id',
              item: {
                originalKey: 'i',
              },
            },
            {
              key: 'name',
              item: {
                originalKey: 'n',
                deserializer: value => `value-${value}`,
              },
            },
          ],
        },
      ]);
      const res = getOriginalKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('i', [
        {
          key: 'id',
          originalKey: 'i',
        },
      ]);
      expacted.set('n', [
        {
          key: 'name',
          originalKey: 'n',
        },
        {
          key: 'nickName',
          originalKey: 'n',
        },
      ]);
      assert.deepEqual(res, expacted);
      mock.restore();
    });

    it('extends an non-model class', () => {
      class BaseModel {}
      class TestModel extends BaseModel {}
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'name',
              item: {
                originalKey: 'n',
              },
            },
          ],
        },
      ]);
      const res = getOriginalKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('n', [
        {
          key: 'name',
          originalKey: 'n',
        },
      ]);
      assert.deepEqual(res, expacted);
      mock.restore();
    });

    it('get original key store from cache', () => {
      class TestModel {}
      const originalKeyStores = new Map();
      const testOriginalKeyStore = new Map();
      testOriginalKeyStore.set('n', [
        {
          key: 'name',
          originalKey: 'n',
        },
      ]);
      originalKeyStores.set(TestModel, testOriginalKeyStore);
      const mock = mockOriginalKeyStores(originalKeyStores);
      const res = getOriginalKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('n', [
        {
          key: 'name',
          originalKey: 'n',
        },
      ]);
      assert.deepEqual(res, expacted);
      mock.restore();
    });

    it('get original key store from cache', () => {
      class TestModel {}
      const originalKeyStores = new Map();
      const testOriginalKeyStore = new Map();
      testOriginalKeyStore.set('n', [
        {
          key: 'name',
          originalKey: 'n',
        },
      ]);
      originalKeyStores.set(TestModel, testOriginalKeyStore);
      const mock = mockOriginalKeyStores(originalKeyStores);
      const res = getOriginalKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('n', [
        {
          key: 'name',
          originalKey: 'n',
        },
      ]);
      assert.deepEqual(res, expacted);
      mock.restore();
    });
  });

  describe('getKeyStore', () => {
    it('normal', () => {
      class BaseModel {}
      class TestModel extends BaseModel {}
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'name',
              item: {
                originalKey: 'n',
              },
            },
          ],
        },
        {
          clazz: BaseModel,
          storeItems: [
            {
              key: 'id',
              item: {
                originalKey: 'i',
              },
            },
            {
              key: 'name',
              item: {
                originalKey: 'n',
                deserializer: value => `value-${value}`,
              },
            },
          ],
        },
      ]);
      const res = getKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('id', {
        key: 'id',
        originalKey: 'i',
      });
      expacted.set('name', {
        key: 'name',
        originalKey: 'n',
      });
      assert.deepEqual(res, expacted);
      mock.restore();
    });

    it('extends an non-model class', () => {
      class BaseModel {}
      class TestModel extends BaseModel {}
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'name',
              item: {
                originalKey: 'n',
              },
            },
          ],
        },
      ]);
      const res = getKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('name', {
        key: 'name',
        originalKey: 'n',
      });
      assert.deepEqual(res, expacted);
      mock.restore();
    });

    it('no-one contain a serializeTarget => error', () => {
      class BaseModel {}
      class TestModel extends BaseModel {}
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'emailPrefix',
              item: {
                originalKey: 'e',
              },
            },
            {
              key: 'email',
              item: {
                originalKey: 'e',
              },
            },
          ],
        },
      ]);
      try {
        getKeyStore(TestModel);
      } catch (err) {
        assert(err.message.indexOf('serializeTarget') >= 0);
      }
      mock.restore();
    });

    it('more than one contain a serializeTarget => error', () => {
      class BaseModel {}
      class TestModel extends BaseModel {}
      const serializer = () => '';
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'emailPrefix',
              item: {
                originalKey: 'e',
                serializeTarget: true,
                serializer,
              },
            },
            {
              key: 'email',
              item: {
                originalKey: 'e',
                serializeTarget: true,
                serializer: () => '1234',
              },
            },
          ],
        },
        {
          clazz: BaseModel,
          storeItems: [
            {
              key: 'email2',
              item: {
                originalKey: 'e',
              },
            },
          ],
        },
      ]);
      try {
        getKeyStore(TestModel);
      } catch (err) {
        assert(err.message.indexOf('serializeTarget') >= 0);
      }
      mock.restore();
    });

    it('only one contain a serializeTarget', () => {
      class BaseModel {}
      class TestModel extends BaseModel {}
      const serializer1 = () => 1;
      const serializer2 = () => 2;
      const mock = mockStore([
        {
          clazz: TestModel,
          storeItems: [
            {
              key: 'emailPrefix',
              item: {
                originalKey: 'e',
                serializer: serializer1,
              },
            },
            {
              key: 'email',
              item: {
                originalKey: 'e',
                serializeTarget: true,
                serializer: serializer2,
              },
            },
          ],
        },
        {
          clazz: BaseModel,
          storeItems: [
            {
              key: 'email2',
              item: {
                originalKey: 'e',
              },
            },
          ],
        },
      ]);
      const res = getKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('email', {
        key: 'email',
        originalKey: 'e',
        serializeTarget: true,
        serializer: serializer2,
      });
      assert.deepEqual(res, expacted);
      mock.restore();
    });

    it('get key store from cache', () => {
      class TestModel {}
      const keyStores = new Map();
      const testKeyStore = new Map();
      testKeyStore.set('name', {
        key: 'name',
        originalKey: 'n',
      });
      keyStores.set(TestModel, testKeyStore);
      const mock = mockKeyStores(keyStores);
      const res = getKeyStore(TestModel);
      const expacted = new Map();
      expacted.set('name', {
        key: 'name',
        originalKey: 'n',
      });
      assert.deepEqual(res, expacted);
      mock.restore();
    });
  });
});
