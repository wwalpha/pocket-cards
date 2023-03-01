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
    LearningService.listByQuestion(qInfo.id, 'qid, userId, lastTime'),
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

  // 学習グループID変更
  learnings.forEach((item) => {
    // 未学習の場合
    if (item.lastTime === Consts.INITIAL_DATE) {
      // 旧カリキュラムの未学習数更新
      oldCurrculums.forEach((item) => {
        tasks.push(CurriculumService.updateUnlearned(item.id, -1));
      });

      // 新カリキュラムの未学習数更新
      newCurrculumns.forEach((item) => {
        tasks.push(CurriculumService.updateUnlearned(item.id, 1));
      });
    }

    // 学習進捗の変更
    tasks.push(
      LearningService.update({
        ...item,
        groupId: newGroupId,
      })
    );
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
