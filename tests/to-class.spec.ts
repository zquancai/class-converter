// eslint-disable-next-line max-classes-per-file
import { ImportMock } from 'ts-mock-imports';
import assert from 'assert';
import { toClass, toClasses } from '../src/to-class';
import * as utils from '../src/utils';

describe('to-class', () => {
  describe('toClass && objectToClass', () => {
    class TestModel {}

    class EducationModel {}

    class EventModel {}

    it('normal', () => {
      const mock = ImportMock.mockFunction(utils, 'getOriginalKeyStore').callsFake(Clazz => {
        const originalKeyStore = new Map();
        if (Clazz === TestModel) {
          originalKeyStore.set('i', [
            {
              key: 'id',
              originalKey: 'i',
            },
            {
              key: 'idd',
              originalKey: 'i',
            },
          ]);
          originalKeyStore.set('nn', [
            {
              key: 'nickName',
              originalKey: 'nn',
              optional: true,
            },
          ]);
          originalKeyStore.set('dp', [
            {
              key: 'department',
              originalKey: 'dp',
              beforeDeserializer: (raw: any) => decodeURI(raw),
              deserializer: (raw: any) => JSON.parse(raw),
            },
          ]);
          originalKeyStore.set('edu', [
            {
              key: 'education',
              originalKey: 'edu',
              targetClass: EducationModel,
            },
          ]);
          originalKeyStore.set('e', [
            {
              key: 'events',
              originalKey: 'e',
              targetClass: EventModel,
            },
          ]);
          originalKeyStore.set('ee', [
            {
              key: 'twoDimensionalEvents',
              originalKey: 'ee',
              targetClass: EventModel,
            },
          ]);
        } else if (Clazz === EducationModel) {
          originalKeyStore.set('i', [
            {
              key: 'id',
              originalKey: 'i',
            },
          ]);
          originalKeyStore.set('sn', [
            {
              key: 'shortName',
              originalKey: 'sn',
            },
          ]);
        } else if (Clazz === EventModel) {
          originalKeyStore.set('i', [
            {
              key: 'id',
              originalKey: 'i',
              default: 0,
            },
          ]);
        }
        return originalKeyStore;
      });
      const res = toClass(
        {
          i: 1000,
          dp: encodeURI(JSON.stringify({ id: 123, n: 'dpname', c: 'cname' })),
          edu: {
            i: 2000,
            sn: 'NUS',
          },
          e: [{ i: 1 }, { i: 2 }, {}],
          ee: [
            [{ i: 1 }, { i: 2 }],
            [{ i: 3 }, { i: 4 }],
          ],
        },
        TestModel,
      );
      assert.deepEqual(res, {
        id: 1000,
        idd: 1000,
        department: { id: 123, n: 'dpname', c: 'cname' },
        education: {
          id: 2000,
          shortName: 'NUS',
        },
        events: [{ id: 1 }, { id: 2 }, { id: 0 }],
        twoDimensionalEvents: [
          [{ id: 1 }, { id: 2 }],
          [{ id: 3 }, { id: 4 }],
        ],
      });
      mock.restore();
    });

    it('allow/disallow ignore beforeDeserializer/deserializer', () => {
      const mock = ImportMock.mockFunction(utils, 'getOriginalKeyStore').callsFake(() => {
        const originalKeyStore = new Map();
        originalKeyStore.set('dp', [
          {
            key: 'department',
            originalKey: 'dp',
            beforeDeserializer: (raw: any) => decodeURI(raw),
          },
        ]);
        originalKeyStore.set('id', [
          {
            key: 'id',
            originalKey: 'id',
            deserializer: (raw: string) => parseInt(raw, 10),
          },
        ]);
        originalKeyStore.set('dp2', [
          {
            key: 'department2',
            originalKey: 'dp2',
            beforeDeserializer: (raw: any) => decodeURI(raw),
            disallowIgnoreBeforeDeserializer: true,
          },
        ]);
        originalKeyStore.set('id2', [
          {
            key: 'id2',
            originalKey: 'id2',
            deserializer: (raw: string) => parseInt(raw, 10),
            disallowIgnoreDeserializer: true,
          },
        ]);
        return originalKeyStore;
      });
      const res = toClass(
        {
          id: '123--',
          dp: encodeURI('{abcd}'),
          id2: '123--',
          dp2: encodeURI('{abcd}'),
        },
        TestModel,
        {
          ignoreBeforeDeserializer: true,
          ignoreDeserializer: true,
        },
      );
      assert.deepEqual(res, {
        id: '123--',
        department: '%7Babcd%7D',
        id2: 123,
        department2: '{abcd}',
      });
      mock.restore();
    });

    it('original value is undefined', () => {
      const mock = ImportMock.mockFunction(utils, 'getOriginalKeyStore').callsFake(() => {
        const originalKeyStore = new Map();
        originalKeyStore.set('i', [
          {
            key: 'id',
            originalKey: 'i',
          },
        ]);
        return originalKeyStore;
      });
      let error: Error;
      try {
        toClass({}, TestModel);
      } catch (err) {
        error = err;
      }
      assert(error && error.message.indexOf('TestModel.id'));
      mock.restore();
    });

    it('original value is null', () => {
      const mock = ImportMock.mockFunction(utils, 'getOriginalKeyStore').callsFake(() => {
        const originalKeyStore = new Map();
        originalKeyStore.set('i', [
          {
            key: 'id',
            originalKey: 'i',
          },
        ]);
        return originalKeyStore;
      });
      let error: Error;
      try {
        toClass({ id: null }, TestModel);
      } catch (err) {
        error = err;
      }
      assert(error && error.message.indexOf('TestModel.id'));
      mock.restore();
    });

    it('original value is null but distinguishNullAndUndefined equal true', () => {
      const mock = ImportMock.mockFunction(utils, 'getOriginalKeyStore').callsFake(() => {
        const originalKeyStore = new Map();
        originalKeyStore.set('i', [
          {
            key: 'id',
            originalKey: 'i',
          },
        ]);
        return originalKeyStore;
      });
      const res = toClass({ i: null }, TestModel, {
        distinguishNullAndUndefined: true,
      });
      assert.deepEqual(res, {
        id: null,
      });
      mock.restore();
    });
  });

  describe('toClasses', () => {
    class TestModel {}

    it('normal', () => {
      const mock = ImportMock.mockFunction(utils, 'getOriginalKeyStore').callsFake(() => {
        const originalKeyStore = new Map();
        originalKeyStore.set('n', [
          {
            key: 'name',
            originalKey: 'n',
          },
        ]);
        return originalKeyStore;
      });
      const res = toClasses([{ n: 'name1' }, { n: 'name2' }], TestModel);
      assert.deepEqual(res, [{ name: 'name1' }, { name: 'name2' }]);
      mock.restore();
    });

    it('not an array', () => {
      let error: Error;
      try {
        toClasses({ n: 'name1' } as any, TestModel);
      } catch (err) {
        error = err;
      }
      assert(error && error.message.indexOf('must be an array') >= 0);
    });
  });
});
