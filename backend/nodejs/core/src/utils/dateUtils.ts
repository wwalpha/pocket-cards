import { Consts } from '@consts';
import moment from 'moment';

export const getNow = () => `${moment().format('YYYYMMDD')}`;

// 算数以外の科目の日数
const days = [1, 2, 5, 10, 20, 60, 90, 90];
// 算数の日数
const daysM = [1, 3, 7, 15, 60];

/** 次回学習時間を計算する */
export const getNextTime = (times: number, subject?: string) => {
  if (times < 1) return getNow();
  // 算数以外の場合、10 回学習後表示しないようにする
  if (times > 8 && subject !== Consts.SUBJECT.MATHS) return '99991231';
  // 7 回学習後表示しないようにする
  if (times > 5 && subject === Consts.SUBJECT.MATHS) return '99991231';

  // 日数の組みの選択
  const nextDays = Consts.SUBJECT.MATHS === subject ? daysM : days;
  // 間隔の日数
  const addValue = nextDays[times - 1];
  // 次の日付
  const nextTime = moment().add(addValue, 'days').format('YYYYMMDD');

  // 文字列を返す
  return `${nextTime}`;
};

export const getTimestamp = () => moment().format('YYYYMMDDHHmmss');

export const getUnixTime = () => Date.now().toString();

export const addDays = (days: number) => moment().add(days, 'days').format('YYYYMMDD');
