import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import { Consts } from '@constants';

const appState: Domains.AppState = {
  activeSubject: Consts.SUBJECT.JAPANESE.toString(),
  tabIndex: 11,
  isLoading: false,
  showSnackbar: false,
  showUserRegist: false,
  status: Consts.SERVER_STATUS.STOPPED,
  displayCtrl: {},
};

const slice = createSlice({
  name: 'app',
  initialState: appState,
  reducers: {
    APP_LOGOUT: () => {},
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

      if (action.payload.name === 'Error') {
        state.showSnackbar = true;
        state.severity = 'error';
        state.message = action.payload.message;
      }
    },

    APP_SHOW_SUCCESS: (state, action: PayloadAction<string>) => {
      state.showSnackbar = true;
      state.severity = 'success';
      state.message = action.payload;
    },

    APP_SHOW_ERROR: (state, action: PayloadAction<string>) => {
      state.showSnackbar = true;
      state.severity = 'error';
      state.message = action.payload;
    },

    APP_CLOSE_SNACKBAR: (state) => {
      state.showSnackbar = false;
      state.severity = undefined;
      state.message = undefined;
    },

    APP_SHOW_USER_REGIST: (state, action: PayloadAction<boolean>) => {
      state.showUserRegist = action.payload;
    },

    // タブ変更
    APP_TAB_INDEX: (state, { payload }: PayloadAction<number>) => {
      state.tabIndex = payload;
    },

    // サーバステータス更新
    SERVER_STATUS: (state, { payload }: PayloadAction<string>) => {
      state.status = payload;
    },

    APP_ACTIVE_SUBJECT: (state, { payload }: PayloadAction<string>) => {
      state.activeSubject = payload;
    },
  },
});

export default slice;
