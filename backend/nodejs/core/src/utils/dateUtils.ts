import { Consts } from '@consts';
import moment from 'moment';

export const getNow = () => `${moment().format('YYYYMMDD')}`;

// 国語以外の場合の日数
const daysCommon = [1, 3, 7, 15, 30, 60, 120, 180];
// 国語の場合の日数
const daysLanguage = [2, 5, 20, 60, 120, 180];

/** 次回学習時間を計算する */
export const getNextTime = (times: number, subject?: string) => {
  // 不正解の場合、次回学習日を今日にする
  if (times < 1) return getNow();

  // 算数の場合、次回学習日を 99991231 にする
  if (subject === Consts.SUBJECT.MATHS) return '99991231';
  // 国語の場合、６回学習後表示しないようにする
  if (times > 7 && subject === Consts.SUBJECT.LANGUAGE) return '99991231';
  // 国語以外の場合、７回学習後表示しないようにする
  if (times > 8 && subject !== Consts.SUBJECT.LANGUAGE) return '99991231';

  // 日数の組みの選択
  const nextDays = Consts.SUBJECT.LANGUAGE === subject ? daysLanguage : daysCommon;
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
