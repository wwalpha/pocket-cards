import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '@components/Loading';
import * as MyPageActions from '@actions/mypage';
import { RootState } from 'typings';
// import { Animation, ValueScale } from '@devexpress/dx-react-chart';
// import { ArgumentAxis, Chart, ValueAxis, BarSeries } from '@devexpress/dx-react-chart-material-ui';

/** 単語カメラ画面 */
const userState = (state: RootState) => state.user;
const appState = (state: RootState) => state.app;

const C002: React.FunctionComponent<any> = () => {
  const { isLoading } = useSelector(appState);
  const { daily, weekly, monthly } = useSelector(userState);
  const actions = bindActionCreators(MyPageActions, useDispatch());

  // Loading中
  if (isLoading) {
    return <Loading />;
  }

  const data = [
    { year: '2000', words: 6 },
    { year: '2010', words: 50 },
  ];

  return (
    <div>1111</div>
    // <Chart data={data} height={400}>
    //   <ArgumentAxis />
    //   <ValueAxis showLabels={false} />
    //   <ValueScale />
    //   <BarSeries valueField="words" argumentField="year" color="red" barWidth={0.2} />
    //   <Animation />
    // </Chart>
  );
};

export default C002;
