import { createEffect } from 'effector';

import { request, type Responder } from './request';
import {
  type GetCenterAvailabilityParams,
  type GetResultParams,
  type GetCenterAvailabilityResponse,
  type GetCentersResponse,
  type Result,
} from './types';

export const api = {
  getCentersFx: createEffect<void, Responder<GetCentersResponse>>(async () =>
    request({
      path: 'centers',
      method: 'GET',
    }),
  ),
  getCenterAvailabilityFx: createEffect<GetCenterAvailabilityParams, Responder<GetCenterAvailabilityResponse>>(async (params) =>
    request({
      path: 'availability',
      method: 'GET',
      params,
    }),
  ),
  getResultFx: createEffect<GetResultParams, Responder<Result>>(async (params) =>
    request({
      path: '',
      method: 'GET',
      params,
    }),
  ),
};

export type Api = typeof api;
