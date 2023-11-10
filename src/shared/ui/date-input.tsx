import { Box, Loader, Tooltip, createStyles, type TooltipProps, rem } from '@mantine/core';
import { type DateInputProps as MantineDateInputProps, DateInput as MantineDateInput } from '@mantine/dates';

const useStyles = createStyles({
  loaderWrapper: {
    position: 'absolute',
    bottom: rem(36 / 2 - 9),
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: rem(36),
  },
});

export type DateInputProps = MantineDateInputProps & {
  tooltip?: string;
  tooltipPosition?: TooltipProps['position'];
  loading?: boolean;
};

// eslint-disable-next-line react/display-name
export const DateInput = ({ disabled, tooltip, tooltipPosition, loading, rightSection, ...other }: DateInputProps): JSX.Element => {
  const { classes } = useStyles();

  if (disabled && tooltip) {
    return (
      <Tooltip label={tooltip} position={tooltipPosition}>
        <span style={{ position: 'relative' }}>
          <MantineDateInput disabled={disabled} {...other} />
          {loading && (
            <Box className={classes.loaderWrapper}>
              <Loader size="xs" />
            </Box>
          )}
        </span>
      </Tooltip>
    );
  }

  return <MantineDateInput disabled={disabled} rightSection={loading ? <Loader size="xs" /> : rightSection} {...other} />;
};
