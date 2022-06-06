import { Action, AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

function isPendingAction(action: AnyAction) {
  return action.type.endsWith('pending');
}

function isFulfilledAction(action: AnyAction) {
  return action.type.endsWith('fulfilled');
}

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith('rejected');
}

const slice = createSlice({
  name: 'app',
  initialState: appState,
  reducers: {
    APP_LOGOUT: () => {},
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

    APP_SET_AUTHORITY: (state, { payload }: PayloadAction<string | undefined>) => {
      state.authority = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPendingAction, (state) => {
        state.isLoading = true;
      })
      .addMatcher(isFulfilledAction, (state) => {
        state.isLoading = false;
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.isLoading = false;
        state.showSnackbar = true;
        state.severity = 'error';
        state.message = action.error.message;
      });
  },
});

export default slice;
