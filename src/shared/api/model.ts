import { createEffect } from 'effector';

import { request, type Responder } from './request';
import { type GetCentersResponse } from './types';

export const getCentersFx = createEffect<void, Responder<GetCentersResponse>>(async () =>
  request({
    path: 'centers',
    method: 'GET',
  }),
);
