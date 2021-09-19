import { Theme, createTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

const theme: Theme = createTheme({
  palette: {
    primary: {
      dark: '#0027B2',
      main: '#005BCC',
      light: '#0099E5',
    },
    secondary: {
      dark: '#00AB8B',
      main: '#00AB8B',
      light: '#ED684A',
    },
    error: {
      main: '#ED684A',
    },
    // primary: {
    //   dark: '#003c8f',
    //   main: '#1565c0',
    //   light: '#5e92f3',
    // },
    // secondary: {
    //   dark: orange.A700,
    //   main: orange.A400,
    //   light: orange.A200,
    // },
  },
});

export default theme;
