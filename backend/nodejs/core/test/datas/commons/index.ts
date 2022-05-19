import * as fs from 'fs';
import * as path from 'path';

import { parse } from 'csv-parse/sync';
import { Tables } from 'typings';

const db_groups: Tables.TGroups[] = [];
const db_questions: Tables.TQuestions[] = [];
const db_curriculums: Tables.TCurriculums[] = [];
const db_learning: Tables.TLearning[] = [];
const db_ability: Tables.TWeeklyAbility[] = [];

export const DB_GROUPS = ((): Tables.TGroups[] => {
  if (db_groups.length > 0) return db_groups;

  return parse(fs.readFileSync(path.join(__dirname, './db_groups.csv')), {
    columns: true,
  }) as Tables.TGroups[];
})();

export const DB_QUESTIONS = (() => {
  if (db_questions.length > 0) return db_questions;

  return parse(fs.readFileSync(path.join(__dirname, './db_questions.csv')), {
    columns: true,
  }) as Tables.TQuestions[];
})();

export const DB_CURRICULUMS = (() => {
  if (db_curriculums.length > 0) return db_curriculums;

  return parse(fs.readFileSync(path.join(__dirname, './db_curriculums.csv')), {
    columns: true,
  }) as Tables.TCurriculums[];
})();

export const DB_LEARNING = (() => {
  if (db_learning.length > 0) return db_learning;

  return parse(fs.readFileSync(path.join(__dirname, './db_learning.csv')), {
    columns: true,
  }) as Tables.TLearning[];
})();

export const DB_ABILITY = (() => {
  if (db_ability.length > 0) return db_ability;

  return parse(fs.readFileSync(path.join(__dirname, './db_weekly_ability.csv')), {
    columns: true,
  }) as Tables.TWeeklyAbility[];
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
