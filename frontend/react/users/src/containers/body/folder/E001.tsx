import React from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FolderIcon from '@mui/icons-material/Folder';
import Button from '@components/buttons/Button';
import { GroupActions } from '@actions';
import { Paths } from '@constants';
import { RootState } from 'typings';

const group = (state: RootState) => state.group;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(GroupActions, dispatch);
  const { groups } = useSelector(group);

  // Folder click
  const handleOnClick = (groupId: string) => {
    // 選択値を保存する
    actions.activeGroup(groupId);

    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]));
  };

  // フォルダなしの場合
  if (groups.length === 0) {
    return (
      <Box margin={2} ml={4} mr={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontSize: '1.5rem' }}
          // @ts-ignore
          component={Link}
          to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.GroupRegist]}>
          フォルダを新規作成
        </Button>
      </Box>
    );
  }

  return (
    <List>
      {groups.map((item, idx) => (
        <ListItem
          key={idx}
          button
          disableRipple
          onClick={() => {
            handleOnClick(item.id);
          }}
          sx={{ width: 'auto', m: 2, bgcolor: 'common.white', borderRadius: 1 }}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              sx: { fontSize: '1.5rem' },
            }}
            secondary={item.description}
          />
        </ListItem>
      ))}
    </List>
  );
};
