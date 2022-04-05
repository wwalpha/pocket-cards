import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      dark: '#000000',
      main: '#180A0A',
      light: '#4a1f1f',
      contrastText: 'white',
    },
    secondary: {
      dark: '#57145b',
      main: '#711A75',
      light: '#904c93',
      contrastText: 'white',
    },
    info: {
      main: '#F10086',
    },
    error: {
      main: '#C74B50',
      contrastText: 'white',
    },
    background: {
      default: '#FEF9EF',
      paper: '#f9f8f6',
    },
    success: {
      main: '#6ECB63',
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
