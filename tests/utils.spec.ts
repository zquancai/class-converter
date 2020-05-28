// eslint-disable-next-line max-classes-per-file
import assert from 'assert';
import { mockStore } from './fixtures';
import { getOriginalKetStore, getKeyStore } from '../src/utils';

describe('utils', () => {
  describe('getOriginalKetStore', () => {
    class BaseModel {}

    class TestModel extends BaseModel {}

    it('normal', () => {
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
      const res = getOriginalKetStore(TestModel);
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
      const res = getOriginalKetStore(TestModel);
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
    class BaseModel {}

    class TestModel extends BaseModel {}

    it('normal', () => {
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
  });
});
