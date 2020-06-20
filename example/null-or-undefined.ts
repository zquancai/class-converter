import assert from 'assert';
import { toPlain, toClass } from '../src';
import { EducationModel } from './models/education';

assert.deepEqual(
  toPlain(
    {
      id: null,
      schoolName: null,
    },
    EducationModel,
    {
      distinguishNullAndUndefined: true,
    },
  ),
  {
    i: null,
    sn: null,
  },
);

assert.deepEqual(
  toPlain(
    {
      id: null,
      schoolName: null,
    },
    EducationModel,
  ),
  {
    sn: '',
  },
);

assert.deepEqual(
  toClass(
    {
      i: null,
      sn: null,
    },
    EducationModel,
    {
      distinguishNullAndUndefined: true,
    },
  ),
  {
    id: null,
    schoolName: null,
  },
);

assert.deepEqual(
  toClass(
    {
      i: null,
      sn: null,
    },
    EducationModel,
  ),
  {
    schoolName: '',
  },
);
