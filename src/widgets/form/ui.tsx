import { Button } from '@iszf-microfrontends/shared-ui';
import { Box, Checkbox, Grid, Group, Loader, NumberInput, Radio, Select, Stack } from '@mantine/core';
import { modelView } from 'effector-factorio';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import { DateInput, TooltipOnFocus } from '~/shared/ui';

import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from './config';
import { formFactory, GeoMagnitude as GeoMagnitudeEnum } from './model';

const Center = (): JSX.Element => {
  const model = formFactory.useModel();
  const [centers, centersPending, center, centerError] = useUnit([
    model.$centers,
    model.$centersPending,
    model.$center,
    model.$centerError,
  ]);

  return (
    <Select
      withAsterisk
      label="Ионосферный центр"
      placeholder="Выберите ионосферный центр"
      data={centers}
      value={center}
      error={centerError}
      onChange={model.centerChanged}
      maxDropdownHeight={200}
      nothingFound="Ничего не найдено"
      searchable
      rightSection={centersPending ? <Loader size="xs" /> : null}
    />
  );
};

const DateRange = (): JSX.Element => {
  const model = formFactory.useModel();
  const states = useUnit({
    minDate: model.$minDate,
    maxDate: model.$maxDate,
    datePending: model.$datePending,
    dateDisabled: model.$dateDisabled,
    dateFrom: model.$dateFrom,
    dateFromError: model.$dateFromError,
    dateTo: model.$dateTo,
    dateToError: model.$dateToError,
  });

  return (
    <Grid>
      <Grid.Col span={6}>
        <DateInput
          withAsterisk
          label="Дата начала"
          placeholder="дд.мм.гггг"
          minDate={states.minDate ?? undefined}
          maxDate={states.maxDate ?? undefined}
          value={states.dateFrom}
          error={states.dateFromError}
          onChange={model.dateFromChanged}
          disabled={states.dateDisabled}
          loading={states.datePending}
          tooltip="Сперва нужно выбрать ионосферный центр"
          tooltipPosition="bottom-start"
          defaultLevel="decade"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <DateInput
          withAsterisk
          label="Дата конца"
          placeholder="дд.мм.гггг"
          minDate={states.minDate ?? undefined}
          maxDate={states.maxDate ?? undefined}
          value={states.dateTo}
          error={states.dateToError}
          onChange={model.dateToChanged}
          disabled={states.dateDisabled}
          loading={states.datePending}
          tooltip="Сперва нужно выбрать ионосферный центр"
          tooltipPosition="bottom-start"
          defaultLevel="decade"
        />
      </Grid.Col>
    </Grid>
  );
};

const Latitude = (): JSX.Element => {
  const model = formFactory.useModel();
  const [minLatitude, maxLatitude] = useUnit([model.$minLatitude, model.$maxLatitude]);

  return (
    <Grid>
      <Grid.Col span={6}>
        <TooltipOnFocus
          tooltip={`${MIN_LATITUDE} — ${MAX_LATITUDE}`}
          component={NumberInput}
          label="Мин. широта"
          value={minLatitude}
          onChange={(val) => {
            model.minLatitudeChanged(+val);
          }}
          min={MIN_LATITUDE}
          max={MAX_LATITUDE}
          precision={1}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TooltipOnFocus
          tooltip={`${MIN_LATITUDE} — ${MAX_LATITUDE}`}
          component={NumberInput}
          label="Макс. широта"
          value={maxLatitude}
          onChange={(val) => {
            model.maxLatitudeChanged(+val);
          }}
          min={MIN_LATITUDE}
          max={MAX_LATITUDE}
          precision={1}
        />
      </Grid.Col>
    </Grid>
  );
};

const Longitude = (): JSX.Element => {
  const model = formFactory.useModel();
  const [minLongitude, maxLongitude] = useUnit([model.$minLongitude, model.$maxLongitude]);

  return (
    <Grid>
      <Grid.Col span={6}>
        <TooltipOnFocus
          tooltip={`${MIN_LONGITUDE} — ${MAX_LONGITUDE}`}
          component={NumberInput}
          label="Мин. долгота"
          value={minLongitude}
          onChange={(val) => {
            model.minLongitudeChanged(+val);
          }}
          min={MIN_LONGITUDE}
          max={MAX_LONGITUDE}
          precision={1}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TooltipOnFocus
          tooltip={`${MIN_LONGITUDE} — ${MAX_LONGITUDE}`}
          component={NumberInput}
          label="Макс. долгота"
          value={maxLongitude}
          onChange={(val) => {
            model.maxLongitudeChanged(+val);
          }}
          min={MIN_LONGITUDE}
          max={MAX_LONGITUDE}
          precision={1}
        />
      </Grid.Col>
    </Grid>
  );
};

const GeoMagnitude = (): JSX.Element => {
  const model = formFactory.useModel();
  const [geoMagnitude] = useUnit([model.$geoMagnitude]);

  return (
    <Radio.Group label="Тип координат" value={geoMagnitude} onChange={model.geoMagnitudeChanged}>
      <Group mt={4}>
        <Radio label="Географические" value={GeoMagnitudeEnum.GEOGRAPHICAL} />
        <Radio label="Геомагнитные" value={GeoMagnitudeEnum.GEOMAGNETIC} />
      </Group>
    </Radio.Group>
  );
};

const NeedToSendRec = (): JSX.Element => {
  const model = formFactory.useModel();
  const [needToSendRec] = useUnit([model.$needToSendRec]);

  return (
    <Checkbox
      label="Передача данных REC в GECu"
      checked={needToSendRec}
      onChange={(ev) => {
        model.needToSendRecChanged(ev.currentTarget.checked);
      }}
    />
  );
};

const NeedToSendWmt = (): JSX.Element => {
  const model = formFactory.useModel();
  const [needToSendWmt] = useUnit([model.$needToSendWmt]);

  return (
    <Checkbox
      label="Передача средневзвешенных данных TEC в TECu"
      checked={needToSendWmt}
      onChange={(ev) => {
        model.needToSendWmtChanged(ev.currentTarget.checked);
      }}
    />
  );
};

export const Form = modelView(formFactory, () => {
  const model = formFactory.useModel();
  const states = useUnit({
    resultPending: model.$resultPending,
  });

  useEffect(() => {
    model.mounted();
  }, [model]);

  return (
    <Box
      maw={420}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        model.formSubmitted();
      }}
    >
      <Grid>
        <Grid.Col span={8}>
          <Center />
        </Grid.Col>
        <Grid.Col>
          <DateRange />
        </Grid.Col>
        <Grid.Col>
          <Latitude />
        </Grid.Col>
        <Grid.Col>
          <Longitude />
        </Grid.Col>
        <Grid.Col>
          <GeoMagnitude />
        </Grid.Col>
        <Grid.Col>
          <Stack>
            <NeedToSendRec />
            <NeedToSendWmt />
          </Stack>
        </Grid.Col>
        <Grid.Col>
          <Button type="submit" loading={states.resultPending}>
            Получить результаты
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
});
