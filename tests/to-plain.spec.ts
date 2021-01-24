// eslint-disable-next-line max-classes-per-file
import { ImportMock } from 'ts-mock-imports';
import assert from 'assert';
import { toPlain, toPlains } from '../src/to-plain';
import * as utils from '../src/utils';

describe('to-plain', () => {
  describe('toPlain && classToObject', () => {
    class TestModel {}

    class EducationModel {}

    class EventModel {}

    it('normal', () => {
      const mock = ImportMock.mockFunction(utils, 'getKeyStore').callsFake(Clazz => {
        const keyStore = new Map();
        if (Clazz === TestModel) {
          keyStore.set('id', {
            key: 'id',
            originalKey: 'i',
            serializeTarget: true,
          });
          keyStore.set('nickName', {
            key: 'nickName',
            originalKey: 'nn',
            optional: true,
          });
          keyStore.set('department', {
            key: 'department',
            originalKey: 'dp',
            afterSerializer: (instanceValue: any) => encodeURI(instanceValue),
            serializer: (instanceValue: any) => JSON.stringify(instanceValue),
          });
          keyStore.set('education', {
            key: 'education',
            originalKey: 'edu',
            targetClass: EducationModel,
          });
          keyStore.set('events', {
            key: 'events',
            originalKey: 'e',
            targetClass: EventModel,
          });
          keyStore.set('twoDimensionalEvents', {
            key: 'twoDimensionalEvents',
            originalKey: 'ee',
            targetClass: EventModel,
          });
        } else if (Clazz === EducationModel) {
          keyStore.set('id', {
            key: 'id',
            originalKey: 'i',
          });
          keyStore.set('shortName', {
            key: 'shortName',
            originalKey: 'sn',
          });
        } else if (Clazz === EventModel) {
          keyStore.set('id', {
            key: 'id',
            originalKey: 'i',
            default: 0,
          });
        }
        return keyStore;
      });
      const res = toPlain(
        {
          id: 1000,
          idd: 1000,
          department: { id: 123, n: 'libs', c: 'seatalk' },
          education: {
            id: 2000,
            shortName: 'NUS',
          },
          events: [{ id: 1 }, { id: 2 }, {}],
          twoDimensionalEvents: [
            [{ id: 1 }, { id: 2 }],
            [{ id: 3 }, { id: 4 }],
          ],
        },
        TestModel,
      );
      assert.deepEqual(res, {
        i: 1000,
        dp: encodeURI(JSON.stringify({ id: 123, n: 'libs', c: 'seatalk' })),
        edu: {
          i: 2000,
          sn: 'NUS',
        },
        e: [{ i: 1 }, { i: 2 }, { i: 0 }],
        ee: [
          [{ i: 1 }, { i: 2 }],
          [{ i: 3 }, { i: 4 }],
        ],
      });
      mock.restore();
    });

    it('allow/disallow ignore afterSerializer/serializer', () => {
      const mock = ImportMock.mockFunction(utils, 'getKeyStore').callsFake(() => {
        const keyStore = new Map();
        keyStore.set('department', {
          key: 'department',
          originalKey: 'dp',
          serializer: (raw: any) => encodeURI(raw),
        });
        keyStore.set('id', {
          key: 'id',
          originalKey: 'id',
          afterSerializer: (raw: number) => raw.toString(),
        });
        keyStore.set('department2', {
          key: 'department2',
          originalKey: 'dp2',
          serializer: (raw: any) => encodeURI(raw),
          disallowIgnoreSerializer: true,
        });
        keyStore.set('id2', {
          key: 'id2',
          originalKey: 'id2',
          afterSerializer: (raw: number) => raw.toString(),
          disallowIgnoreAfterSerializer: true,
        });
        return keyStore;
      });
      const res = toPlain(
        {
          id: '123.5',
          department: '%7Babcd%7D',
          id2: 123.5,
          department2: '{abcd}',
        },
        TestModel,
        {
          ignoreAfterSerializer: true,
          ignoreSerializer: true,
        },
      );
      assert.deepEqual(res, {
        id: '123.5',
        dp: encodeURI('{abcd}'),
        id2: '123.5',
        dp2: encodeURI('{abcd}'),
      });
      mock.restore();
    });

    it('original value is undefined', () => {
      const mock = ImportMock.mockFunction(utils, 'getKeyStore').callsFake(() => {
        const keyStore = new Map();
        keyStore.set('id', {
          key: 'id',
          originalKey: 'i',
        });
        return keyStore;
      });
      let error: Error;
      try {
        toPlain({}, TestModel);
      } catch (err) {
        error = err;
      }
      assert(error && error.message.indexOf('TestModel.id') >= 0);
      mock.restore();
    });

    it('original value is null', () => {
      const mock = ImportMock.mockFunction(utils, 'getKeyStore').callsFake(() => {
        const keyStore = new Map();
        keyStore.set('id', {
          key: 'id',
          originalKey: 'i',
        });
        return keyStore;
      });
      let error: Error;
      try {
        toPlain({ id: null }, TestModel);
      } catch (err) {
        error = err;
      }
      assert(error && error.message.indexOf('TestModel.id') >= 0);
      mock.restore();
    });

    it('original value is null but distinguishNullAndUndefined equal true', () => {
      const mock = ImportMock.mockFunction(utils, 'getKeyStore').callsFake(() => {
        const keyStore = new Map();
        keyStore.set('id', {
          key: 'id',
          originalKey: 'i',
        });
        return keyStore;
      });

      const res = toPlain({ id: null }, TestModel, {
        distinguishNullAndUndefined: true,
      });
      assert.deepEqual(res, {
        i: null,
      });
      mock.restore();
    });
  });

  describe('toPlains', () => {
    class TestModel {}

    it('normal', () => {
      const mock = ImportMock.mockFunction(utils, 'getKeyStore').callsFake(() => {
        const keyStore = new Map();
        keyStore.set('name', {
          key: 'name',
          originalKey: 'n',
        });
        return keyStore;
      });
      const res = toPlains([{ name: 'name1' }, { name: 'name2' }], TestModel);
      assert.deepEqual(res, [{ n: 'name1' }, { n: 'name2' }]);
      mock.restore();
    });

    it('not an array', () => {
      let error: Error;
      try {
        toPlains({ n: 'name1' } as any, TestModel);
      } catch (err) {
        error = err;
      }
      assert(error && error.message.indexOf('must be an array') >= 0);
    });
  });
});
