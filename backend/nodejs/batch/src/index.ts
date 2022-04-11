import { CreateReports, Scheduler } from './func';

export const batch = async () => {
  // count
  await CreateReports();

  // 週間予定
  await Scheduler();
};

// batch();
