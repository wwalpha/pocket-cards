import moment from 'moment';

export const getNow = () => `${moment().format('YYYYMMDD')}`;

const days = [1, 2, 4, 7, 15, 30, 60, 90, 180, 360];

/** 次回学習時間を計算する */
export const getNextTime = (times: number) => {
  if (times === 0) return getNow();
  // 10 回学習後表示しないようにする
  if (times > 10) return '99991231';

  const addValue = days[times - 1];

  const nextTime = moment().add(addValue, 'days').format('YYYYMMDD');

  return `${nextTime}`;
};

export const getTimestamp = () => moment().format('YYYYMMDDHHmmss');
