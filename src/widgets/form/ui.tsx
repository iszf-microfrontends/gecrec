// import { Box, Button, Checkbox, Grid, Group, NumberInput, Radio, Select, Stack } from '@mantine/core';
// import { useUnit } from 'effector-react';
// import { useEffect } from 'react';

import { Button } from '@iszf-microfrontends/shared-ui';
import { Box, Grid, Loader, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import {
  $center,
  $centerError,
  $centers,
  $centersPending,
  $dateFrom,
  $dateFromError,
  $dateTo,
  $dateToError,
  $maxDate,
  $minDate,
  centerChanged,
  dateFromChanged,
  dateToChanged,
  formSubmitted,
  mounted,
} from './model';

// import { TooltipOnFocus } from '~/shared/ui';

// import { MAX_LAT, MAX_LON, MIN_LAT, MIN_LON } from './config';
// import {
//   $maxLat,
//   $minLat,
//   mounted,
//   minLatChanged,
//   maxLatChanged,
//   $minLon,
//   $maxLon,
//   minLonChanged,
//   maxLonChanged,
//   $begin,
//   $end,
//   beginChanged,
//   endChanged,
//   formSubmitted,
//   $sendRec,
//   $sendWmt,
//   sendRecChanged,
//   sendWmtChanged,
//   $centers,
//   $center,
//   centerChanged,
//   $geomag,
//   geomagChanged,
// } from './model';

// const LatRow = (): JSX.Element => {
//   const states = useUnit({ minLat: $minLat, maxLat: $maxLat });

//   return (
//     <Grid>
//       <Grid.Col span={6}>
//         <TooltipOnFocus
//           tooltip={`${MIN_LAT} до ${MAX_LAT}`}
//           Component={NumberInput}
//           label="Мин. широта"
//           value={states.minLat}
//           onChange={(v) => {
//             minLatChanged(+v);
//           }}
//           min={MIN_LAT}
//           max={MAX_LAT}
//           precision={1}
//         />
//       </Grid.Col>
//       <Grid.Col span={6}>
//         <TooltipOnFocus
//           tooltip={`${MIN_LAT} до ${MAX_LAT}`}
//           Component={NumberInput}
//           label="Макс. широта"
//           value={states.maxLat}
//           onChange={(v) => {
//             maxLatChanged(+v);
//           }}
//           min={MIN_LAT}
//           max={MAX_LAT}
//           precision={1}
//         />
//       </Grid.Col>
//     </Grid>
//   );
// };

// const LonRow = (): JSX.Element => {
//   const states = useUnit({ minLon: $minLon, maxLon: $maxLon });

//   return (
//     <Grid>
//       <Grid.Col span={6}>
//         <TooltipOnFocus
//           tooltip={`${MIN_LON} до ${MAX_LON}`}
//           Component={NumberInput}
//           label="Мин. долгота"
//           value={states.minLon}
//           onChange={(v) => {
//             minLonChanged(+v);
//           }}
//           min={MIN_LON}
//           max={MAX_LON}
//           precision={1}
//         />
//       </Grid.Col>
//       <Grid.Col span={6}>
//         <TooltipOnFocus
//           tooltip={`${MIN_LON} до ${MAX_LON}`}
//           Component={NumberInput}
//           label="Макс. долгота"
//           value={states.maxLon}
//           onChange={(v) => {
//             maxLonChanged(+v);
//           }}
//           min={MIN_LON}
//           max={MAX_LON}
//           precision={1}
//         />
//       </Grid.Col>
//     </Grid>
//   );
// };

// // TODO: valueFormat вынести в MantineProvider хоста
// const DateRow = (): JSX.Element => {
//   const states = useUnit({ begin: $begin, end: $end });

//   return (
//     <Grid>
// <Grid.Col span={6}>
//   <DateInput required label="Начало" placeholder="дд.мм.гггг" value={states.begin} onChange={beginChanged} />
// </Grid.Col>
// <Grid.Col span={6}>
//   <DateInput required label="Конец" placeholder="дд.мм.гггг" value={states.end} onChange={endChanged} />
// </Grid.Col>
//     </Grid>
//   );
// };

// export const Form = (): JSX.Element => {
//   const states = useUnit({ geomag: $geomag, sendRec: $sendRec, sendWmt: $sendWmt, centers: $centers, center: $center });

//   useEffect(() => {
//     mounted();
//   }, []);

//   return (
//     <Box
// maw={420}
// component="form"
// onSubmit={(e) => {
//   e.preventDefault();
//   formSubmitted();
// }}
//     >
//       <Grid>
//         <Grid.Col>
//           <LatRow />
//         </Grid.Col>
//         <Grid.Col>
//           <LonRow />
//         </Grid.Col>
//         <Grid.Col>
//           <DateRow />
//         </Grid.Col>
//         <Grid.Col>
//           <Radio.Group label="Тип координат" value={states.geomag} onChange={geomagChanged}>
//             <Group mt={4}>
//               <Radio label="Географические" value="false" />
//               <Radio label="Геомагнитные" value="true" />
//             </Group>
//           </Radio.Group>
//         </Grid.Col>
//         <Grid.Col span={8}>
// <Select
//   required
//   label="Ионосферный центр"
//   placeholder="Выберите центр"
//   data={states.centers}
//   value={states.center}
//   onChange={centerChanged}
//   maxDropdownHeight={200}
//   nothingFound="Ничего не найдено"
//   searchable
// />
//         </Grid.Col>
//         <Grid.Col>
//           <Stack>
//             <Checkbox
//               label="Передача данных REC в GECu"
//               checked={states.sendRec}
//               onChange={(e) => {
//                 sendRecChanged(e.currentTarget.checked);
//               }}
//             />
//             <Checkbox
//               label="Передача средневзвешенных данных TEC в TECu"
//               checked={states.sendWmt}
//               onChange={(e) => {
//                 sendWmtChanged(e.currentTarget.checked);
//               }}
//             />
//           </Stack>
//         </Grid.Col>
//         <Grid.Col>
//           <Button type="submit">Получить результаты</Button>
//         </Grid.Col>
//       </Grid>
//     </Box>
//   );
// };

const CenterSelect = (): JSX.Element => {
  const [centers, centersPending, center, centerError] = useUnit([$centers, $centersPending, $center, $centerError]);

  return (
    <Select
      withAsterisk
      label="Ионосферный центр"
      placeholder="Выберите центр"
      data={centers}
      value={center}
      error={centerError}
      onChange={centerChanged}
      maxDropdownHeight={200}
      nothingFound="Ничего не найдено"
      searchable
      rightSection={centersPending ? <Loader size="sm" /> : null}
    />
  );
};

const DateInputs = (): JSX.Element => {
  const states = useUnit({
    minDate: $minDate,
    maxDate: $maxDate,
    dateFrom: $dateFrom,
    dateFromError: $dateFromError,
    dateTo: $dateTo,
    dateToError: $dateToError,
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
          onChange={dateFromChanged}
          rightSection={<Loader size="sm" />}
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
          onChange={dateToChanged}
          rightSection={<Loader size="sm" />}
        />
      </Grid.Col>
    </Grid>
  );
};

export const Form = (): JSX.Element => {
  useEffect(() => {
    mounted();
  }, []);

  return (
    <Box
      maw={420}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        formSubmitted();
      }}
    >
      <Grid>
        <Grid.Col span={8}>
          <CenterSelect />
        </Grid.Col>
        <Grid.Col>
          <DateInputs />
        </Grid.Col>
        <Grid.Col>
          <Button type="submit">Получить результаты</Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
