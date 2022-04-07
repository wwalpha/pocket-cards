import { TraceCount, Scheduler } from './func';

export const batch = async () => {
  // count
  await TraceCount();

  // 週間予定
  await Scheduler();
};

// batch();
