import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Theme, makeStyles, createStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { RegistActions } from '@actions';
import { Button } from '@components/buttons';
import { WordEdit } from '@components/functions';
import { Consts } from '@constants';
import { RootState } from 'typings';

const styles = {
  list: {
    m: 0,
    p: 0,
    height: `calc(100vh - ${Consts.HEADER_HEIGHT + Consts.FOOT_HEIGHT + 96}px)`,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  button: { width: 15 },
};

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

const a002: FunctionComponent<any> = () => {
  const { regists } = useSelector(groupState);
  const { isLoading } = useSelector(appState);
  const actions = bindActionCreators(RegistActions, useDispatch());

  /** 単語登録 */
  const handleRegist = () => {
    actions.registWords([...regists]);
  };

  /** 単語削除 */
  const handleRemove = (word: string) => {
    actions.removeWord(word);
  };

  // 単語データなし
  if (!isLoading && regists.length === 0) {
    console.log('Do no have any more words');
    return <div />;
  }

  return (
    <Box margin="8px 16px">
      <List sx={styles.list}>
        {regists.map((value, idx) => (
          <React.Fragment key={idx}>
            <WordEdit key={idx} word={value} onDelete={handleRemove} />
            <Divider key={`${value}1`} />
          </React.Fragment>
        ))}
      </List>
      <Box padding={1} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          sx={styles.button}
          onClick={handleRegist}
          size="large"
          isLoading={isLoading}>
          登　録
        </Button>
      </Box>
    </Box>
  );
};

export default a002;
