import * as fs from 'fs';
import * as path from 'path';

import { parse } from 'csv-parse/sync';
import { Tables } from 'typings';

let db_users: Tables.TUsers[] = [];
let db_groups: Tables.TGroups[] = [];
let db_questions: Tables.TQuestions[] = [];
let db_curriculums: Tables.TCurriculums[] = [];
let db_learning: Tables.TLearning[] = [];
let db_inquiry: Tables.TInquiry[] = [];

export const DB_USERS = ((): Tables.TUsers[] => {
  if (db_users.length > 0) return db_users;

  const datas = parse(fs.readFileSync(path.join(__dirname, './db_users.csv')), {
    columns: true,
  }) as Record<string, string>[];

  db_users = datas.map<Tables.TUsers>((item) => ({
    id: item['id'] ?? '',
    authority: item['authority'] ?? '',
    role: item['role'] ?? '',
    username: item['username'] ?? '',
    teacher: item['teacher'] ?? '',
    sub: item['sub'] ?? '',
  }));

  return db_users;
})();

export const DB_GROUPS = ((): Tables.TGroups[] => {
  if (db_groups.length > 0) return db_groups;

  const datas = parse(fs.readFileSync(path.join(__dirname, './db_groups.csv')), {
    columns: true,
  }) as Record<string, string>[];

  db_groups = datas.map<Tables.TGroups>((item) => ({
    id: item['id'] ?? '',
    count: item['count'] ? Number(item['count']) : -1,
    subject: item['subject'] ?? '',
    description: item['description'],
    name: item['name'],
  }));

  return db_groups;
})();

export const DB_QUESTIONS = (() => {
  if (db_questions.length > 0) return db_questions;

  const datas = parse(fs.readFileSync(path.join(__dirname, './db_questions.csv')), {
    columns: true,
  }) as Record<string, string>[];

  db_questions = datas.map<Tables.TQuestions>((item) => {
    return {
      id: item['id'] ?? '',
      answer: item['answer'] ?? '',
      groupId: item['groupId'] ?? '',
      subject: item['subject'] ?? '',
      title: item['title'] ?? '',
      voiceAnswer: item['voiceAnswer'] ?? '',
      voiceTitle: item['voiceTitle'] ?? '',
      description: item['description'] === '' ? undefined : item['description'],
      choices:
        item['choices'] === ''
          ? undefined
          : (JSON.parse(item['choices'] ?? '[]') as string[]).map((t) => t[0] as string),
    };
  });

  return db_questions;
})();

export const DB_CURRICULUMS = (() => {
  if (db_curriculums.length > 0) return db_curriculums;

  const datas = parse(fs.readFileSync(path.join(__dirname, './db_curriculums.csv')), {
    columns: true,
  }) as Record<string, string>[];

  db_curriculums = datas.map<Tables.TCurriculums>((item) => ({
    id: item['id'] ?? '',
    groupId: item['groupId'] ?? '',
    guardian: item['guardian'] ?? '',
    order: item['order'] ? Number(item['order']) : 999,
    subject: item['subject'] ?? '',
    unlearned: item['unlearned'] ? Number(item['unlearned']) : 0,
    userId: item['userId'] ?? '',
  }));

  return db_curriculums;
})();

export const DB_LEARNING = (() => {
  if (db_learning.length > 0) return db_learning;

  const datas = parse(fs.readFileSync(path.join(__dirname, './db_learning.csv')), {
    columns: true,
  }) as Record<string, string>[];

  db_learning = datas.map<Tables.TLearning>((item) => ({
    qid: item['qid'] ?? '',
    groupId: item['groupId'] ?? '',
    nextTime: item['nextTime'] ?? '',
    lastTime: item['lastTime'],
    userId: item['userId'] ?? '',
    subject: item['subject'],
    times: item['times'] ? Number(item['times']) : 0,
    subject_status: item['subject_status'] !== '' ? item['subject_status'] : undefined,
    subject_weekly: item['subject_weekly'] !== '' ? item['subject_weekly'] : undefined,
  }));

  return db_learning;
})();

export const DB_INQUIRY = (() => {
  if (db_inquiry.length > 0) return db_inquiry;

  db_inquiry = parse(fs.readFileSync(path.join(__dirname, './db_inquiry.csv')), {
    columns: true,
  }) as Tables.TInquiry[];

  return db_inquiry;
})();

export const USER_GUARDIAN: Tables.TUsers = {
  id: 'guardian@gmail.com',
  authority: 'PARENT',
  email: 'guardian@gmail.com',
  notification: ['guardian@gmail.com', 'guardian2@gmail.com'],
  role: 'TENANT_USER',
  sub: '6a9182ed-e948-442f-8a3f-3bcfdb8b8e23',
  username: 'guardian',
};

export const USER_STUDENT: Tables.TUsers = {
  id: 'Google_109439805128280065775',
  authority: 'STUDENT',
  email: 'test016@Session10+',
  role: 'TENANT_USER',
  teacher: 'guardian@gmail.com',
  username: 'Google_109439805128280065775',
};
