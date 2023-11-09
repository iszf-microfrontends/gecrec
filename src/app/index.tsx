import { Box, MantineProvider, type MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import Content from '~/content';

const themeOverride: MantineThemeOverride = {
  components: {
    DateInput: {
      defaultProps: {
        valueFormat: 'DD.MM.YYYY',
      },
    },
  },
};

export const App = (): JSX.Element => (
  <MantineProvider theme={themeOverride} withNormalizeCSS>
    <Notifications />
    <Box p={20}>
      <Content />
    </Box>
  </MantineProvider>
);
