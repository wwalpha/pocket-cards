import { CreateReports, Scheduler, LearningStatus } from './func';

export const batch = async () => {
  // count
  await CreateReports();

  // 学習状況の設定
  await LearningStatus();

  // 週間予定
  await Scheduler();
};

// batch();
