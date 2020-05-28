import assert from 'assert';
import { toClass, toPlain } from '../src';
import { PackageModel } from './package';
import raw from './fixtures/raw.json';
import instance from './fixtures/instance.json';
import { LatestPackageModel } from './latest-package';
import { UserModel } from './user';
import { DepartmentModel } from './department';
import { EducationModel } from './education';

// simple usage
assert.deepEqual(toClass(raw, PackageModel), instance);

assert.deepEqual(toPlain(instance, PackageModel), raw);

// as a constructor
const user = new UserModel({
  ...instance.creator,
  department: new DepartmentModel(instance.creator.department),
  educations: instance.creator.educations.map(education => new EducationModel(education)),
});

assert.deepEqual(user, instance.creator);

const pkg = new PackageModel({
  ...instance,
  creator: new UserModel({ ...user }),
});
assert.deepEqual(pkg.toPlain(), raw);
assert.deepEqual(pkg.toJSON(), instance);

const latestPkg = new LatestPackageModel({
  ...instance,
  test: 123,
  creator: user,
});
assert.deepEqual(toClass({ ...raw, t: 123 }, LatestPackageModel), latestPkg);
assert.deepEqual(latestPkg.toPlain(), { ...raw, t: 123 });
assert.deepEqual(latestPkg.toJSON(), { ...instance, test: 123 });
