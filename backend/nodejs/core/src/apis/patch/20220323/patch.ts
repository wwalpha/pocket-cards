import { CurriculumService, LearningService, QuestionService } from '@services';

export default async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';

  //@ts-ignore
  if ('1' === '2') {
    await fixNextTime(userId);

    await fixLearning(userId);
  }

  await fixTestStatus(userId);
};

const fixTestStatus = async (userId: string) => {
  const allDatas = await LearningService.scan();

  const userDatas = allDatas.filter((item) => item.userId === userId);

  const pastDatas = userDatas
    .filter((item) => item.nextTime <= '20221112')
    .filter((item) => item.subject_status === undefined);

  console.log(pastDatas.length);

  let tasks = pastDatas
    .map((item) => {
      item.subject_status = `${item.subject}_TEST`;
      return item;
    })
    .map((item) => LearningService.update(item));

  await Promise.all(tasks);

  const futureDatas = userDatas
    .filter((item) => item.nextTime > '20221112')
    .filter((item) => item.lastTime === '20221112')
    .filter((item) => item.subject_status === undefined);

  console.log(futureDatas.length);

  tasks = futureDatas
    .map((item) => {
      item.subject_status = `${item.subject}_TEST`;
      return item;
    })
    .map((item) => LearningService.update(item));

  await Promise.all(tasks);
};

const fixNextTime = async (userId: string) => {
  const learnings = await LearningService.scan();

  const targets = learnings.filter((item) => item.userId === userId).filter((item) => item.nextTime === undefined);

  const tasks = targets.map(async (item) => {
    const question = await QuestionService.describe(item.qid);

    if (question) {
      await LearningService.update({
        ...item,
        nextTime: '20201029',
        lastTime: '20201028',
        groupId: question.groupId,
      });
    }
  });

  await Promise.all(tasks);
};

const fixLearning = async (userId: string) => {
  const curriculums = await CurriculumService.getListByGuardian('wwalpha80@gmail.com');
  const datas = curriculums.filter((item) => item.userId === userId);

  const results: string[] = [];
  for (let i = 0; i < datas.length; i++) {
    const curriculum = datas[i];

    if (!curriculum) continue;

    const questions = await QuestionService.listByGroup(curriculum.groupId, 'id', 'groupId');
    const learnings = await LearningService.listByGroup(curriculum.groupId, userId);

    console.log(questions);
    console.log(learnings);
    console.log(questions.length);
    console.log(learnings.length);
    questions.forEach((q) => {
      const learning = learnings.find((l) => l.qid === q.id);

      if (!learning) {
        results.push(`${curriculum.groupId}, ${q.id}`);
      }
    });
  }

  results.forEach(console.log);
  console.log(results.length);
};
