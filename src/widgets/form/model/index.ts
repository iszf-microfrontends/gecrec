import { attach, combine, createEvent, createStore, sample } from 'effector';
import { modelFactory, type Model } from 'effector-factorio';
import { every, not, or, reset } from 'patronum';

import { type GetResultParams, type GetCenterAvailabilityParams } from '~/shared/api';
import { errorNotified, formatDate } from '~/shared/lib';

import { MIN_LONGITUDE, MAX_LONGITUDE, MIN_LATITUDE, MAX_LATITUDE } from '../config';

import { type FormFactoryOptions, GeoMagnitude } from './types';

export * from './types';

export const formFactory = modelFactory(({ api, resultReceived }: FormFactoryOptions) => {
  const getCentersFx = attach({ effect: api.getCentersFx });
  const getCenterAvailabilityFx = attach({ effect: api.getCenterAvailabilityFx });
  const getResultFx = attach({ effect: api.getResultFx });

  const mounted = createEvent();

  const centerChanged = createEvent<string>();

  const dateFromChanged = createEvent<Date>();
  const dateToChanged = createEvent<Date>();

  const minLatitudeChanged = createEvent<number>();
  const maxLatitudeChanged = createEvent<number>();

  const minLongitudeChanged = createEvent<number>();
  const maxLongitudeChanged = createEvent<number>();

  const geoMagnitudeChanged = createEvent<GeoMagnitude>();

  const needToSendRecChanged = createEvent<boolean>();
  const needToSendWmtChanged = createEvent<boolean>();

  const formSubmitted = createEvent();

  const $centers = createStore<string[]>([]);
  const $centersPending = getCentersFx.pending;

  const $center = createStore('');
  const $centerError = createStore<string | null>(null);
  const $centerSelected = $center.map((state) => !!state);

  const $minDate = createStore<Date | null>(null);
  const $maxDate = createStore<Date | null>(null);
  const $datePending = getCenterAvailabilityFx.pending;
  const $dateDisabled = or($datePending, not($centerSelected));

  const $dateFrom = createStore<Date | null>(null);
  const $dateFromError = createStore<string | null>(null);

  const $dateTo = createStore<Date | null>(null);
  const $dateToError = createStore<string | null>(null);

  const $minLatitude = createStore(0);
  const $maxLatitude = createStore(0);

  const $minLongitude = createStore(0);
  const $maxLongitude = createStore(0);

  const $geoMagnitude = createStore(GeoMagnitude.GEOGRAPHICAL);

  const $needToSendRec = createStore(false);
  const $needToSendWmt = createStore(false);

  const $resultPending = getResultFx.pending;

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
      $dateFromError,
      $dateTo,
      $dateToError,
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

  $minLatitude.on(minLatitudeChanged, (_, lat) => lat);
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

  if (resultReceived) {
    sample({ clock: getResultFx.doneData, target: resultReceived });
  }

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

  return {
    mounted,
    centerChanged,
    dateFromChanged,
    dateToChanged,
    minLatitudeChanged,
    maxLatitudeChanged,
    minLongitudeChanged,
    maxLongitudeChanged,
    geoMagnitudeChanged,
    needToSendRecChanged,
    needToSendWmtChanged,
    formSubmitted,
    $centers,
    $centersPending,
    $center,
    $centerError,
    $centerSelected,
    $minDate,
    $maxDate,
    $datePending,
    $dateDisabled,
    $dateFrom,
    $dateFromError,
    $dateTo,
    $dateToError,
    $minLatitude,
    $maxLatitude,
    $minLongitude,
    $maxLongitude,
    $geoMagnitude,
    $needToSendRec,
    $needToSendWmt,
    $resultPending,
  };
});

export type FormModel = Model<typeof formFactory>;
