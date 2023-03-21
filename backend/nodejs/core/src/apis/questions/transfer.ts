import { Request } from 'express';
import { APIs } from 'typings';
import { CurriculumService, GroupService, LearningService, QuestionService, TraceService } from '@services';
import { Consts } from '@consts';

/** 問題カード一括追加 */
export default async (
  req: Request<APIs.QuestionTransferParams, any, APIs.QuestionTransferRequest, any>
): Promise<APIs.QuestionTransferResponse> => {
  const { newGroupId } = req.body;
  const { groupId } = req.params;

  // validation
  const qInfo = await validate(req);

  const [learnings, traces, oldCurrculums, newCurrculumns] = await Promise.all([
    LearningService.listByQuestion(qInfo.id, 'qid, userId, groupId, lastTime'),
    TraceService.listByQuestion(qInfo.id),
    CurriculumService.listByGroup(groupId),
    CurriculumService.listByGroup(newGroupId),
  ]);

  const tasks: Promise<any>[] = [];

  // 問題情報更新
  tasks.push(
    QuestionService.update({
      ...qInfo,
      groupId: newGroupId,
    })
  );

  // 新グループ問題数＋１
  tasks.push(GroupService.plusCount(newGroupId, 1));
  // 旧グループ問題数ー１
  tasks.push(GroupService.minusCount(groupId, 1));

  // 旧カリキュラムで考える、不要な学習タスクを削除する
  oldCurrculums.forEach((o) => {
    const finded = newCurrculumns.find((n) => o.userId === n.userId);

    // 両方学習中の場合、アカウントを更新
    if (finded) {
      // 旧カリキュラム学習中の問題はグループIDのみ更新
      const usrLearning = learnings.filter((item) => item.groupId === o.groupId && item.userId === o.userId);
      const count = usrLearning.filter((item) => item.lastTime === Consts.INITIAL_DATE).length;

      // 旧カリキュラムの未学習数更新
      if (count > 0) {
        // 旧カリキュラムの未学習数更新
        tasks.push(CurriculumService.updateUnlearned(o.id, -1));
        // 新カリキュラムの未学習数更新
        tasks.push(CurriculumService.updateUnlearned(finded.id, 1));
      }

      usrLearning.forEach((item) =>
        tasks.push(
          LearningService.update({
            ...item,
            groupId: newGroupId,
          })
        )
      );
    } else {
      // 新カリキュラムは学習中ではない場合は、学習進捗を削除する
      const usrLearning = learnings.filter((item) => item.groupId === o.groupId && item.userId === o.userId);

      const count = usrLearning.filter((item) => item.lastTime === Consts.INITIAL_DATE).length;

      // 旧カリキュラムの未学習数更新
      if (count > 0) {
        tasks.push(CurriculumService.updateUnlearned(o.id, -1 * count));
      }

      usrLearning.forEach((item) => tasks.push(LearningService.remove(item.qid, item.userId)));
    }
  });

  // 新カリキュラムで考える、不足な学習タスクを追加する
  newCurrculumns.forEach((n) => {
    const finded = oldCurrculums.find((o) => n.userId === o.userId);

    // 既に処理済み
    if (finded) {
      return;
    }

    // 新カリキュラムにしかないので、新タスクを追加する
    tasks.push(
      LearningService.regist({
        qid: qInfo.id,
        userId: n.userId,
        groupId: n.groupId,
        subject: qInfo.subject,
        lastTime: Consts.INITIAL_DATE,
        nextTime: Consts.INITIAL_DATE,
        times: qInfo.subject === Consts.SUBJECT.LANGUAGE ? 0 : -1,
      })
    );

    // 新カリキュラムの未学習数更新
    tasks.push(CurriculumService.updateUnlearned(n.id, 1));
  });

  // 履歴の変更
  traces.forEach((item) =>
    tasks.push(
      TraceService.update({
        ...item,
        groupId: newGroupId,
      })
    )
  );

  await Promise.all(tasks);
};

const validate = async (req: Request<APIs.QuestionTransferParams, any, APIs.QuestionTransferRequest, any>) => {
  const { newGroupId } = req.body;
  const { questionId, groupId } = req.params;

  // ユーザのグループID 一覧
  const [qInfo, oldGInfo, newGInfo] = await Promise.all([
    await QuestionService.describe(questionId),
    await GroupService.describe(groupId),
    await GroupService.describe(newGroupId),
  ]);

  // validation
  if (!qInfo) {
    throw new Error(`Question id is not exist. ${questionId}`);
  }

  // validation
  if (!newGInfo) {
    throw new Error(`New group id is not exist. ${newGroupId}`);
  }

  // validation
  if (!oldGInfo) {
    throw new Error(` group id is not exist. ${groupId}`);
  }

  // validation
  if (oldGInfo.subject !== newGInfo.subject) {
    throw new Error(`Subject not same. ${oldGInfo.subject}`);
  }

  return qInfo;
};
