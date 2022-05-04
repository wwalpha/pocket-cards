import React, { FunctionComponent, Fragment, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { Consts } from '@constants';
import { Group } from 'typings';

const list: FunctionComponent<WordListProps> = ({ list, showDelete, onDetail, onDelete }) => {
  const [index, setIndex] = useState(10);
  const handleOnClick = (dataRow: Group.WordSimple) => onDetail?.(dataRow);
  const handleOnDelete = (dataRow: Group.WordSimple) => onDelete?.(dataRow);

  const handleOnScroll = (e: any) => {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight - 20) {
      const nextIndex = index + 10;

      setIndex(nextIndex > list.length ? list.length : nextIndex);
    }
  };

  return (
    <List
      sx={{
        pt: 1,
        pb: 0,
        height: `calc(100vh - ${Consts.HEADER_HEIGHT + Consts.FOOT_HEIGHT + 152}px)`,
        overflowY: 'auto',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      onScroll={handleOnScroll}>
      {list.slice(0, index).map((item, idx) => (
        <Fragment key={idx}>
          <ListItem sx={{ bgcolor: 'grey.100', pt: 0.5, pb: 0.5 }} divider>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <Button
                  sx={{ color: 'common.white', fontSize: '0.75rem' }}
                  onClick={() => {
                    handleOnClick(item);
                  }}>
                  詳細
                </Button>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item.id.split('+').join(' ')}
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
              secondary={item.vocabulary}
              secondaryTypographyProps={{
                variant: 'body2',
              }}
              sx={{ m: 0 }}
            />
            {showDelete ? (
              <ListItemSecondaryAction>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    handleOnDelete(item);
                  }}>
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </ListItemSecondaryAction>
            ) : undefined}
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};

interface WordListProps {
  list: Group.WordSimple[];
  onDetail?: (details: Group.WordSimple) => void;
  onDelete?: (details: Group.WordSimple) => void;
  showDelete?: boolean;
}

export default list;
