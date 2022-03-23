import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      dark: '#81a8cc',
      main: '#A2D2FF',
      light: '#b4dbff',
      contrastText: '#696969',
    },
    secondary: {
      dark: '#cc6b4b',
      main: '#FF865E',
      light: '#ff9e7e',
      contrastText: 'white',
    },
    error: {
      main: '#ED684A',
      contrastText: 'white',
    },
    background: {
      default: '#FEF9EF',
      paper: '#e4e0d7',
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
