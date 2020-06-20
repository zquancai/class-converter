import { PackageModel } from './package';
import { property, defaultVal } from '../../src';

export class LatestPackageModel extends PackageModel<LatestPackageModel> {
  @defaultVal(0)
  @property('t')
  test?: number;
}
