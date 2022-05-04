// import React from 'react';
// import { bindActionCreators } from 'redux';
// import { useDispatch } from 'react-redux';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import { Route, Switch, useRouteMatch } from 'react-router-dom';
// import { DrawerLeft, Mainboard, GroupDetails, QuestionList } from '.';
// import { default as styles } from './Dashboard.style';
// import { Paths } from '@constants';
// import { AppActions } from '@actions';

// const Dashboard = () => {
//   const { path } = useRouteMatch();
//   const actions = bindActionCreators(AppActions, useDispatch());

//   const handleLogout = () => actions.logout();

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <DrawerLeft />
//       <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
//         <AppBar
//           position="static"
//           sx={{
//             boxShadow: 'none',
//             height: ({ spacing }) => spacing(8),
//             bgcolor: 'primary.dark',
//             userSelect: 'none',
//           }}>
//           <Toolbar>
//             <Typography variant="h6" noWrap component="div">
//               管理者画面
//             </Typography>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 sx={{ mx: 1, borderRadius: 0, width: 96 }}
//                 onClick={handleLogout}>
//                 LOGOUT
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         <Switch>
//           <Route exact path={path} component={Mainboard} />
//           <Route path={Paths.PATHS_ADMIN_GROUP_DETAILS} component={GroupDetails} />
//           <Route path={Paths.PATHS_ADMIN_GROUP_QUESTIONS} component={QuestionList} />
//         </Switch>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
