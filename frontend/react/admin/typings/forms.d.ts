import { Users } from 'typings';

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
}
