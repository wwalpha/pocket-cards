import { Users } from 'typings';

export interface SignInForm {
  username: string;
  password: string;
}

export interface SignUpForm {
  role: string;
  email: string;
  username: string;
}

export interface NewPasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
