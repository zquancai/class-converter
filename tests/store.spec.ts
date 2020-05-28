import assert from 'assert';
import store, { setStore } from '../src/store';

class TestModel {}

describe('store', () => {
  const deserializer = () => '123';
  const expectStore = new Map();
  const targetClassStore = new Map();

  it('normal', () => {
    targetClassStore.set('id', {
      originalKey: 'i',
      targetClass: TestModel,
    });
    expectStore.set(TestModel.constructor, targetClassStore);
    setStore(TestModel, {
      key: 'id',
      originalKey: 'i',
      targetClass: TestModel,
    });
    assert.deepEqual(store, expectStore);

    setStore(TestModel, {
      key: 'id',
      deserializer,
    });
    targetClassStore.set('id', {
      originalKey: 'i',
      targetClass: TestModel,
      deserializer,
    });
    expectStore.set(TestModel.constructor, targetClassStore);
    assert.deepEqual(store, expectStore);
  });
});
