import express from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { collectDefaultMetrics, register } from 'prom-client';
import { GroupRegist, GroupList, GroupDescribe, GroupUpdate, GroupRemove } from '@src/apis/groups';
import {
  QuestionRegist,
  QuestionList,
  QuestionUpdate,
  QuestionDelete,
  QuestionIgnore,
  QuestionDescribe,
  QuestionOrder,
  QuestionTransfer,
} from '@src/apis/questions';
import {
  DailyStatus,
  DailyTestQuestions,
  LearningProgress,
  LearningOverall,
  OverallStatus,
  CurriculumStatus,
  CurriculumOverall,
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
import { Handwriting, Image2Text } from '@src/apis/vision';
import { LearningDescribe } from './apis/learning';
import { Patchs } from '@src/apis/patch';
import { DailyAnswer, DailyPractice, DailyExam, DailyReview } from '@src/apis/study';
import entry from './entry';

// collect prometheus default metrics
collectDefaultMetrics();

const app = express();

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/v1/health', (_, res) => res.send('backend'));

// prometheus metrics
app.get('/metrics', async (_, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(await register.metrics());
});

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
// 問題新規登録
app.post('/v1/groups/:groupId/questions/:questionId/transfer', express.json(), (req, res) =>
  entry(req, res, QuestionTransfer)
);

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
// カリキュラム学習進捗
app.post('/v1/reports/overall/curriculums', express.json(), (req, res) => entry(req, res, CurriculumOverall));
// 全体学習進捗
app.get('/v1/reports/status/overall', express.json(), (req, res) => entry(req, res, OverallStatus));
// 日次学習進捗
app.get('/v1/reports/status/daily', express.json(), (req, res) => entry(req, res, DailyStatus));
// カリキュラム別の学習状況
app.post('/v1/reports/status/curriculums', express.json(), (req, res) => entry(req, res, CurriculumStatus));
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

// 自己練習問題取得
app.post('/v1/study/daily/practice', express.json(), (req, res) => entry(req, res, DailyPractice));
// 自己試験問題取得
app.post('/v1/study/daily/exam', express.json(), (req, res) => entry(req, res, DailyExam));
// 自己試験問題更新
app.post('/v1/study/daily/answer', express.json(), (req, res) => entry(req, res, DailyAnswer));
// 自己試験問題更新
app.post('/v1/study/daily/review', express.json(), (req, res) => entry(req, res, DailyReview));

// 週テスト対策の問題登録
app.post('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyRegist));
// 週テスト対策の問題一覧
app.get('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyList));
// 週テスト対策の実力テストの回答
app.post('/v1/study/weekly/:questionId', express.json(), (req, res) => entry(req, res, WeeklyAnswer));

// カリキュラム順で学習
app.get('/v1/study/daily/order/questions', express.json(), (req, res) => entry(req, res, QuestionOrder));

// 対象問題の学習状況取得
app.get('/v1/study/learning/:qid', express.json(), (req, res) => entry(req, res, LearningDescribe));

// patch
app.patch('/v1/patch', express.json(), (req, res) => entry(req, res, Patchs));

// handwriting
app.post('/v1/vision/handwriting', express.json(), (req, res) => entry(req, res, Handwriting));

app.post('/v1/vision/image2text', express.json(), (req, res) => entry(req, res, Image2Text));

export default app;

// 復習問題取得
// app.get('/v1/study/daily/review/questions', express.json(), (req, res) => entry(req, res, QuestionReview));
