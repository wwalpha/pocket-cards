import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Loading from '@components/Loading';
import * as MyPageActions from '@actions/mypage';
import { RootState } from 'typings';

const userState = (state: RootState) => state.user;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(MyPageActions, useDispatch());
  const { remainingTest, remainingReview, daily, dailyNew, dailyReview, weekly, monthly } = useSelector(userState);
  const { isLoading } = useSelector(appState);

  React.useMemo(() => {
    // actions.history();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid container justifyContent="center" sx={{ py: 2 }}>
      <Grid container justifyContent="center" sx={{ py: 1 }}>
        <Card
          sx={{
            width: ({ spacing }) => spacing(22.5),
            height: ({ spacing }) => spacing(15),
            m: 1,
          }}>
          <CardContent>
            <Typography color="textSecondary">今日の残単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {remainingTest}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ width: ({ spacing }) => spacing(22.5), height: ({ spacing }) => spacing(15), m: 1 }}>
          <CardContent>
            <Typography color="textSecondary">今日の残復習単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {remainingReview}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid container justifyContent="center" sx={{ py: 1 }}>
        <Card sx={{ width: ({ spacing }) => spacing(22.5), height: ({ spacing }) => spacing(15), m: 1 }}>
          <CardContent>
            <Typography color="textSecondary">今日の新規単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {dailyNew}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ width: ({ spacing }) => spacing(22.5), height: ({ spacing }) => spacing(15), m: 1 }}>
          <CardContent>
            <Typography color="textSecondary">今日の復習単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {dailyReview}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid container justifyContent="center" sx={{ py: 1 }}>
        <Card sx={{ width: ({ spacing }) => spacing(22.5), height: ({ spacing }) => spacing(15), m: 1 }}>
          <CardContent>
            <Typography color="textSecondary">今日の学習単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {daily}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ width: ({ spacing }) => spacing(22.5), height: ({ spacing }) => spacing(15), m: 1 }}>
          <CardContent>
            <Typography color="textSecondary">直近７日の単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {weekly}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid container justifyContent="center" sx={{ py: 1 }}>
        <Card sx={{ width: ({ spacing }) => spacing(22.5), height: ({ spacing }) => spacing(15), m: 1 }}>
          <CardContent>
            <Typography color="textSecondary">直近３０日の単語数</Typography>
          </CardContent>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography sx={{ fontSize: '2rem', textAlign: 'center' }} color="textPrimary">
                  {monthly}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color="textSecondary">単語</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
