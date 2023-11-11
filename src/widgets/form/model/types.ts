import { type Event } from 'effector';

import { type Result, type Api } from '~/shared/api';

export type FormFactoryOptions = {
  api: Api;
  resultReceived?: Event<Result>;
};

export enum GeoMagnitude {
  GEOGRAPHICAL = 'false',
  GEOMAGNETIC = 'true',
}
