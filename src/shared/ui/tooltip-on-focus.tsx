import { Tooltip } from '@mantine/core';
import { useState, type JSXElementConstructor } from 'react';

export type TooltipOnFocusProps<T extends { onFocus?: (e: any) => void; onBlur?: (e: any) => void }> = {
  component: JSXElementConstructor<T>;
  tooltip: string;
} & T;

export const TooltipOnFocus = <T extends { onFocus?: (e: any) => void; onBlur?: (e: any) => void }>({
  component: Component,
  tooltip,
  ...props
}: TooltipOnFocusProps<T>): JSX.Element => {
  const [opened, setOpened] = useState(false);

  return (
    <Tooltip label={tooltip} opened={opened} position="bottom-start" withArrow>
      <Component
        {...(props as unknown as T)}
        onFocus={(e) => {
          setOpened(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setOpened(false);
          props.onBlur?.(e);
        }}
      />
    </Tooltip>
  );
};
