import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import { Consts } from '@constants';

const appState: Domains.AppState = {
  tabIndex: 11,
  isLoading: false,
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
    },

    // タブ変更
    APP_TAB_INDEX: (state, { payload }: PayloadAction<number>) => {
      state.tabIndex = payload;
    },

    // サーバステータス更新
    SERVER_STATUS: (state, { payload }: PayloadAction<string>) => {
      state.status = payload;
    },

    // グループ選択
    // GROUP_SELECT: (state, { payload }: PayloadAction<string>) => {
    //   state.groupId = payload;
    // },

    /** 画面表示制御 */
    // DISPLAY_CONTROL: (state, { payload: { type, value } }: PayloadAction<Actions.ShowPayload>) => {
    //   state.displayCtrl[type] = value;
    // },
  },
});

export default slice;
