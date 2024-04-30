import { CreateReports, CalcAccuracy, LearningStatus } from './func';

export const batch = async () => {
  // count
  await CreateReports();

  // 学習状況の設定
  await LearningStatus();

  // 正解率の更新
  await CalcAccuracy();

  // 週間予定
  // await Scheduler();
};

// batch();
