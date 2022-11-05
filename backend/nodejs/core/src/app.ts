import express from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { GroupRegist, GroupList, GroupDescribe, GroupUpdate, GroupRemove } from '@src/apis/groups';
import {
  QuestionRegist,
  QuestionStudy,
  QuestionExam,
  QuestionAnswer,
  QuestionList,
  QuestionUpdate,
  QuestionDelete,
  QuestionIgnore,
  QuestionReview,
  QuestionDescribe,
  QuestionOrder,
} from '@src/apis/questions';
import {
  DailyStatus,
  DailyTestQuestions,
  LearningProgress,
  LearningOverall,
  OverallStatus,
  CurriculumStatus,
} from '@src/apis/reports';
import {
  CurriculumRegist,
  CurriculumList,
  CurriculumRemove,
  CurriculumQuestions,
  CurriculumOrder,
  CurriculumIgnore,
} from '@src/apis/curriculums';
import { WeeklyRegist, WeeklyList, WeeklyAnswer } from '@src/apis/weekly';
import { InquiryList, InquiryRegist, InquiryRemove } from '@src/apis/inquiry';
import { Handwriting } from '@src/apis/vision';
import { LearningDescribe } from './apis/learning';
import { Patchs } from '@src/apis/patch';
import entry from './entry';

const app = express();

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/v1/health', (_, res) => res.send('backend'));

// グループ新規登録
app.post('/v1/groups', express.json(), (req, res) => entry(req, res, GroupRegist));
// グループ一覧取得
app.get('/v1/groups', express.json(), (req, res) => entry(req, res, GroupList));
// グループ詳細取得
app.get('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupDescribe));
// グループ情報更新
app.put('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupUpdate));
// グループ削除
app.delete('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupRemove));

// 問題新規登録
app.post('/v1/groups/:groupId/questions', express.json(), (req, res) => entry(req, res, QuestionRegist));
// 問題一覧取得
app.get('/v1/groups/:groupId/questions', express.json(), (req, res) => entry(req, res, QuestionList));
// 問題詳細取得
app.get('/v1/groups/:groupId/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionDescribe));
// 問題詳細情報更新
app.put('/v1/groups/:groupId/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionUpdate));
// 問題削除
app.delete('/v1/groups/:groupId/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionDelete));

// 問い合わせ新規登録
app.post('/v1/inquiries', express.json(), (req, res) => entry(req, res, InquiryRegist));
// 問い合わせ一覧取得
app.get('/v1/inquiries', express.json(), (req, res) => entry(req, res, InquiryList));
// 問い合わせ削除
app.delete('/v1/inquiries/:id', express.json(), (req, res) => entry(req, res, InquiryRemove));

// 問題無視機能
app.post('/v1/groups/:groupId/questions/ignore', express.json(), (req, res) => entry(req, res, QuestionIgnore));

// leaning progress
app.get('/v1/reports/progress', express.json(), (req, res) => entry(req, res, LearningProgress));
// leaning overall
app.get('/v1/reports/overall', express.json(), (req, res) => entry(req, res, LearningOverall));
// 全体学習進捗
app.get('/v1/reports/status/overall', express.json(), (req, res) => entry(req, res, OverallStatus));
// 日次学習進捗
app.get('/v1/reports/status/daily', express.json(), (req, res) => entry(req, res, DailyStatus));

// カリキュラム別の学習状況
app.get('/v1/reports/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumStatus));
// 科目別テスト問題の一覧
app.post('/v1/reports/questions/dailytest', express.json(), (req, res) => entry(req, res, DailyTestQuestions));

// カリキュラム登録
app.post('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumRegist));
// カリキュラム一覧
app.get('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumList));
// カリキュラム削除
app.delete('/v1/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumRemove));
// カリキュラムの問題集一覧
app.get('/v1/curriculums/:curriculumId/questions', express.json(), (req, res) => entry(req, res, CurriculumQuestions));
// カリキュラム並べ順更新
app.post('/v1/curriculums/:curriculumId/order', express.json(), (req, res) => entry(req, res, CurriculumOrder));
// カリキュラムの問題集一覧
app.get('/v1/curriculums/:curriculumId/questions/:questionId/ignore', express.json(), (req, res) =>
  entry(req, res, CurriculumIgnore)
);

// 週テスト対策の問題登録
app.post('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyRegist));
// 週テスト対策の問題一覧
app.get('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyList));
// 週テスト対策の実力テストの回答
app.post('/v1/study/weekly/:questionId', express.json(), (req, res) => entry(req, res, WeeklyAnswer));

// カリキュラム順で学習
app.get('/v1/study/daily/order/questions', express.json(), (req, res) => entry(req, res, QuestionOrder));
// 復習問題取得
app.get('/v1/study/daily/review/questions', express.json(), (req, res) => entry(req, res, QuestionReview));
// 練習問題取得
app.get('/v1/study/daily/practice/questions', express.json(), (req, res) => entry(req, res, QuestionStudy));
// テスト問題取得
app.get('/v1/study/daily/test/questions', express.json(), (req, res) => entry(req, res, QuestionExam));
// テスト問題更新
app.post('/v1/study/daily/test/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionAnswer));

// 対象問題の学習状況取得
app.get('/v1/study/learning/:qid', express.json(), (req, res) => entry(req, res, LearningDescribe));

// patch
app.patch('/v1/patch', express.json(), (req, res) => entry(req, res, Patchs));

// handwriting
app.post('/v1/vision/handwriting', express.json(), (req, res) => entry(req, res, Handwriting));

export default app;
