import React, { FunctionComponent } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';

const styles = {
  root: {
    width: 42,
    height: 26,
    padding: 0,
    m: 1,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: 'common.white',
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: (theme: any) => ({
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  }),
  checked: {},
  focusVisible: {},
};

const iosswitch: FunctionComponent<Props> = (props) => {
  return (
    <Switch
      // focusVisibleClassName={styles.focusVisible}
      disableRipple
      // styles={{
      //   root: styles.root,
      //   switchBase: styles.switchBase,
      //   thumb: styles.thumb,
      //   track: styles.track,
      //   checked: styles.checked,
      // }}
      {...props}
    />
  );
};

interface Props extends SwitchProps {}

export default iosswitch;
