import { createEffect } from 'effector';

import { request, type Responder } from './request';
import {
  type GetCenterAvailabilityParams,
  type GetResultParams,
  type GetCenterAvailabilityResponse,
  type GetCentersResponse,
} from './types';

export const getCentersFx = createEffect<void, Responder<GetCentersResponse>>(async () =>
  request({
    path: 'centers',
    method: 'GET',
  }),
);

export const getCenterAvailabilityFx = createEffect<GetCenterAvailabilityParams, Responder<GetCenterAvailabilityResponse>>(async (params) =>
  request({
    path: 'availability',
    method: 'GET',
    params,
  }),
);

export const getResultFx = createEffect<GetResultParams, Responder<unknown>>(async (params) =>
  request({
    path: '',
    method: 'GET',
    params,
  }),
);
