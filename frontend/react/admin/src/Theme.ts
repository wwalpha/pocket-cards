import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      dark: '#750537',
      main: '#970747',
      light: '#ae3e6f',
    },
    secondary: {
      dark: '#136a85',
      main: '#1989AC',
      light: '#4ca3be',
      contrastText: 'white',
    },
    info: {
      main: '#283E56',
    },
    error: {
      main: '#C74B50',
      contrastText: 'white',
    },
    background: {
      default: '#FEF4E8',
      paper: '#FEF4E8',
    },
    success: {
      main: '#2FB390',
      contrastText: 'white',
    },
    warning: {
      main: '#FEE440',
      contrastText: 'white',
    },

    // primary: {
    //   dark: '#0027B2',
    //   main: '#005BCC',
    //   light: '#0099E5',
    // },
    // secondary: {
    //   dark: '#00AB8B',
    //   main: '#00AB8B',
    //   light: '#ED684A',
    // },
    // error: {
    //   main: '#ED684A',
    // },

    //   // primary: {
    //   //   dark: '#003c8f',
    //   //   main: '#1565c0',
    //   //   light: '#5e92f3',
    //   // },
    //   // secondary: {
    //   //   dark: orange.A700,
    //   //   main: orange.A400,
    //   //   light: orange.A200,
    //   // },
  },
});

export default theme;
