import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import { Consts } from '@constants';

const appState: Domains.AppState = {
  tabIndex: 11,
  isLoading: false,
  showSnackbar: false,
  status: Consts.SERVER_STATUS.STOPPED,
  displayCtrl: {},
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

    // タブ変更
    APP_TAB_INDEX: (state, { payload }: PayloadAction<number>) => {
      state.tabIndex = payload;
    },

    // サーバステータス更新
    SERVER_STATUS: (state, { payload }: PayloadAction<string>) => {
      state.status = payload;
    },
  },
});

export default slice;
