import { Consts } from '@constants';
import { Action, AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';

const appState: Domains.AppState = {
  isLoading: false,
  showSnackbar: false,
  showUserRegist: false,
  isConnectionEstablished: false,
  isConnecting: false,
  subject: Consts.SUBJECT.MATHS,
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
    // start loading
    APP_START_LOADING: (state) => {
      state.isLoading = true;
    },

    // end loading
    APP_END_LOADING: (state) => {
      state.isLoading = false;
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

    APP_SET_AUTHORITY: (state, { payload }: PayloadAction<string | undefined>) => {
      state.authority = payload;
    },
    APP_CONNECT: (state) => {
      state.isConnecting = true;
    },
    APP_CONNECTED: (state) => {
      state.isConnecting = false;
      state.isConnectionEstablished = true;
    },
    APP_DISCONNECT: (state) => {
      state.isConnecting = false;
      state.isConnectionEstablished = false;
    },
    APP_ACTIVE_SUBJECT: (state, { payload }: PayloadAction<string>) => {
      state.subject = payload;
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
