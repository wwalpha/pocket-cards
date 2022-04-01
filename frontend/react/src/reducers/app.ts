import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains, Auth } from 'typings';
import { Consts } from '@constants';

const appState: Domains.AppState = {
  tabIndex: 11,
  isLoading: false,
  isLogined: false,
  status: Consts.SERVER_STATUS.STOPPED,
  displayCtrl: {},
  username: '',
  mfaRequired: false,
  newPasswordRequired: false,
  tokens: {},
};

const slice = createSlice({
  name: 'app',
  initialState: appState,
  reducers: {
    // start loading
    APP_START_LOADING: (state) => {
      state.isLoading = true;
    },

    // end loading
    APP_END_LOADING: (state) => {
      state.isLoading = false;
    },

    // end loading
    APP_COM_01_FAILURE: (state, action: PayloadAction<Error>) => {
      state.isLoading = false;
    },

    // タブ変更
    APP_TAB_INDEX: (state, { payload }: PayloadAction<number>) => {
      state.tabIndex = payload;
    },

    // サーバステータス更新
    SERVER_STATUS: (state, { payload }: PayloadAction<string>) => {
      state.status = payload;
    },

    SIGN_IN: (state, { payload }: PayloadAction<Auth.SignInResponse & Auth.SignInRequest>) => {
      state.mfaRequired = payload.mfaRequired;
      state.newPasswordRequired = payload.newPasswordRequired;
      state.username = payload.username;

      if (payload.idToken && payload.accessToken && payload.refreshToken) {
        state.tokens = {
          idToken: payload.idToken,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        };
      }
    },
  },
});

export default slice;
