import assert from 'assert';
import { toClass, toPlain } from '../src';
import { PackageModel } from './models/package';
import raw from './fixtures/raw.json';
import instance from './fixtures/instance.json';
import { LatestPackageModel } from './models/latest-package';
import { UserModel } from './models/user';
import { DepartmentModel } from './models/department';
import { EducationModel } from './models/education';

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
assert.deepEqual(toPlain(pkg, PackageModel), raw);

const latestPkg = new LatestPackageModel({
  ...instance,
  test: 123,
  creator: user,
});

assert.deepEqual(toClass({ ...raw, t: 123 }, LatestPackageModel), latestPkg);
assert.deepEqual(toPlain(latestPkg, LatestPackageModel), { ...raw, t: 123 });

const latestPkg1 = new LatestPackageModel({
  ...instance,
  creator: user,
});
assert.deepEqual(toPlain(latestPkg1, LatestPackageModel), { ...raw, t: 0 });
