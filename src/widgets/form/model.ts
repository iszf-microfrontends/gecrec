import { attach, combine, createEvent, createStore, sample } from 'effector';
import { every, not, or, reset } from 'patronum';

import { api, type GetResultParams, type GetCenterAvailabilityParams, type Result } from '~/shared/api';
import { errorNotified, formatDate } from '~/shared/lib';

import { MIN_LONGITUDE, MAX_LONGITUDE, MIN_LATITUDE, MAX_LATITUDE } from './config';

export enum GeoMagnitude {
  GEOGRAPHICAL = 'false',
  GEOMAGNETIC = 'true',
}

const getCentersFx = attach({ effect: api.getCentersFx });
const getCenterAvailabilityFx = attach({ effect: api.getCenterAvailabilityFx });
const getResultFx = attach({ effect: api.getResultFx });

export const mounted = createEvent();

export const centerChanged = createEvent<string>();

export const dateFromChanged = createEvent<Date>();
export const dateToChanged = createEvent<Date>();

export const minLatitudeChanged = createEvent<number>();
export const maxLatitudeChanged = createEvent<number>();

export const minLongitudeChanged = createEvent<number>();
export const maxLongitudeChanged = createEvent<number>();

export const geoMagnitudeChanged = createEvent<GeoMagnitude>();

export const needToSendRecChanged = createEvent<boolean>();
export const needToSendWmtChanged = createEvent<boolean>();

export const formSubmitted = createEvent();

export const resultReceived = createEvent<Result>();

export const $centers = createStore<string[]>([]);
export const $centersPending = getCentersFx.pending;

export const $center = createStore('');
export const $centerError = createStore<string | null>(null);
const $centerSelected = $center.map((state) => !!state);

export const $minDate = createStore<Date | null>(null);
export const $maxDate = createStore<Date | null>(null);
export const $datePending = getCenterAvailabilityFx.pending;
export const $dateDisabled = or($datePending, not($centerSelected));

export const $dateFrom = createStore<Date | null>(null);
export const $dateFromError = createStore<string | null>(null);

export const $dateTo = createStore<Date | null>(null);
export const $dateToError = createStore<string | null>(null);

export const $minLatitude = createStore(0);
export const $maxLatitude = createStore(0);

export const $minLongitude = createStore(0);
export const $maxLongitude = createStore(0);

export const $geoMagnitude = createStore(GeoMagnitude.GEOGRAPHICAL);

export const $needToSendRec = createStore(false);
export const $needToSendWmt = createStore(false);

export const $resultPending = getResultFx.pending;

const $formValues = combine({
  center: $center,
  dateFrom: $dateFrom,
  dateTo: $dateTo,
  minLatitude: $minLatitude,
  maxLatitude: $maxLatitude,
  minLongitude: $minLongitude,
  maxLongitude: $maxLongitude,
  geoMagnitude: $geoMagnitude,
  needToSendRec: $needToSendRec,
  needToSendWmt: $needToSendWmt,
});

const $formValid = every({ stores: [$centerError, $dateFromError, $dateToError], predicate: null });

reset({
  clock: mounted,
  target: [
    $centers,
    $center,
    $minDate,
    $maxDate,
    $dateFrom,
    $dateTo,
    $minLatitude,
    $maxLatitude,
    $minLongitude,
    $maxLongitude,
    $needToSendRec,
    $needToSendWmt,
  ],
});

reset({
  clock: centerChanged,
  target: [$minDate, $maxDate, $dateFrom, $dateTo],
});

sample({ clock: mounted, target: [getCentersFx] });

$centers.on(getCentersFx.doneData, (_, res) => res.data.available_centers);

$center.on(centerChanged, (_, cen) => cen);
$centerError.on(centerChanged, () => null);

$minDate.on(getCenterAvailabilityFx.doneData, (_, res) => new Date(res.data.begin));
$maxDate.on(getCenterAvailabilityFx.doneData, (_, res) => new Date(res.data.end));

$dateFrom.on(dateFromChanged, (_, date) => date);
$dateFromError.on(dateFromChanged, () => null);

$dateTo.on(dateToChanged, (_, date) => date);
$dateToError.on(dateToChanged, () => null);

$minLatitude.on(minLatitudeChanged, (_, lat) => (lat > MAX_LATITUDE ? MAX_LATITUDE : Math.max(lat, MIN_LATITUDE)));
$maxLatitude.on(maxLatitudeChanged, (_, lat) => (lat > MAX_LATITUDE ? MAX_LATITUDE : Math.max(lat, MIN_LATITUDE)));

$minLongitude.on(minLongitudeChanged, (_, lon) => (lon > MAX_LONGITUDE ? MAX_LONGITUDE : Math.max(lon, MIN_LONGITUDE)));
$maxLongitude.on(maxLongitudeChanged, (_, lon) => (lon > MAX_LONGITUDE ? MAX_LONGITUDE : Math.max(lon, MIN_LONGITUDE)));

$geoMagnitude.on(geoMagnitudeChanged, (_, val) => val);

$needToSendRec.on(needToSendRecChanged, (_, val) => val);
$needToSendWmt.on(needToSendWmtChanged, (_, val) => val);

sample({ clock: centerChanged, fn: (center): GetCenterAvailabilityParams => ({ center }), target: getCenterAvailabilityFx });

sample({ clock: formSubmitted, source: $center, fn: (cen) => (cen ? null : 'Поле обязательное'), target: $centerError });
sample({ clock: formSubmitted, source: $dateFrom, fn: (date) => (date ? null : 'Поле обязательное'), target: $dateFromError });
sample({ clock: formSubmitted, source: $dateTo, fn: (date) => (date ? null : 'Поле обязательное'), target: $dateToError });

sample({
  clock: formSubmitted,
  source: $formValues,
  filter: $formValid,
  fn: (values): GetResultParams => ({
    center: values.center,
    begin: formatDate(values.dateFrom as Date),
    end: formatDate(values.dateTo as Date),
    min_lat: values.minLatitude,
    max_lat: values.maxLatitude,
    min_lon: values.minLongitude,
    max_lon: values.maxLongitude,
    geomag: values.geoMagnitude,
    send_rec: values.needToSendRec,
    send_wmt: values.needToSendWmt,
  }),
  target: getResultFx,
});

sample({ clock: getResultFx.doneData, target: resultReceived });

sample({
  clock: getCentersFx.fail,
  target: errorNotified.prepend(() => ({
    title: 'Ошибка!',
    message: 'Произшола ошибка при получении центров',
  })),
});

sample({
  clock: getCenterAvailabilityFx.fail,
  target: errorNotified.prepend(() => ({
    title: 'Ошибка!',
    message: 'Произшола ошибка при получении свободных дат центра',
  })),
});

sample({
  clock: getResultFx.fail,
  target: errorNotified.prepend(() => ({
    title: 'Ошибка!',
    message: 'Произшола ошибка при получении результата',
  })),
});

if (__DEV__) {
  getResultFx.doneData.watch(console.log);
}
