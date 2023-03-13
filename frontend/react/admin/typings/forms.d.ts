import { Users } from 'typings';
import { Dayjs } from 'dayjs';

export interface SignInForm {
  username: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  username: string;
}

export interface NewPasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface GroupEditForm {
  id?: string;
  name: string;
  description: string;
  subject: string;
  grade: string;
}

export interface UserForm {
  username: string;
  password: string;
}

export interface SettingsForm {
  notification1: string;
  notification2: string;
  activeStudent: string;
}

export interface QuestionForm {
  id?: string;
  title: string;
  answer: string;
  choices?: string;
  original?: string;
  description?: string;
  groupId: string;
  category: string;
  tags?: string;
  qNo?: string;
  difficulty?: string;
}

export interface QuestionTransferForm {
  id: string;
  title: string;
  groupId: string;
  groupName?: string;
  newGroupId: string;
}

export interface AbilityForm {
  student: string;
  subject: string;
  groupIds: string[];
}

export interface GroupParams {
  subject?: string;
}

export interface GroupDetailsParams {
  subject: string;
  groupId?: string;
}

export interface QuestionParams {
  subject: string;
  groupId: string;
  questionId: string;
}

export interface AbilityParams {
  subject: string;
}

export interface HeaderParams {
  subject: string;
  groupId: string;
}

export interface HistorySearchForm {
  datetime: string;
  userId: string;
  subject: string;
  groupId: string;
}

export interface MultiTestForm {
  userId: string;
  subject: string;
  review: boolean;
}

export interface ProgressSearchForm {
  student: string;
  subject: string;
  curriculums: string[];
  startDate?: Dayjs;
  endDate?: Dayjs;
  unlearned: boolean;
}
