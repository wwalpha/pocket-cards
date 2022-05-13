import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AsyncThunkFulfilledActionCreator,
  AsyncThunkPendingActionCreator,
  AsyncThunkRejectedActionCreator,
} from '@reduxjs/toolkit/dist/createAsyncThunk';
import { Domains } from 'typings';

const appState: Domains.AppState = {
  isLoading: false,
  showSnackbar: false,
  showUserRegist: false,
};

function isPendingAction(action: AnyAction): action is AsyncThunkPendingActionCreator<any, any> {
  return action.type.endsWith('pending');
}

function isFulfilledAction(action: AnyAction): action is AsyncThunkFulfilledActionCreator<any, any, any> {
  return action.type.endsWith('fulfilled');
}

function isRejectedAction(action: AnyAction): action is AsyncThunkRejectedActionCreator<any, any> {
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
      .addMatcher(isRejectedAction, (state) => {
        state.isLoading = false;
      });
  },
});

export default slice;
