import React, { FunctionComponent, Fragment, useState, UIEventHandler } from 'react';
import {
  ListItem,
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Button,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { Consts } from '@constants';
import { APIs } from 'typings';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      paddingTop: spacing(1),
      paddingBottom: spacing(0),
      height: `calc(100vh - ${Consts.HEADER_HEIGHT + Consts.FOOT_HEIGHT + 152}px)`,
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    itemIcon: { justifyContent: 'center' },
    itemTextRoot: {
      margin: '0px',
      '& .MuiTypography-subtitle1': {
        fontSize: '1rem',
        lineHeight: '1.5',
      },
    },
    item: { backgroundColor: palette.grey[100], paddingTop: spacing(0.5), paddingBottom: spacing(0.5) },
    avatar: { backgroundColor: palette.primary.light },
    avatarBtn: { color: palette.common.white, fontSize: '0.75rem' },
  })
);

const list: FunctionComponent<WordListProps> = ({ list, showDelete, onDetail, onDelete }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(10);

  const handleOnClick = (word: string) => onDetail?.(word);
  const handleOnDelete = (word: string) => onDelete?.(word);

  const handleOnScroll = (e: any) => {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight - 20) {
      const nextIndex = index + 10;

      setIndex(nextIndex > list.length ? list.length : nextIndex);
    }
  };

  return (
    <List className={classes.root} onScroll={handleOnScroll}>
      {list.slice(0, index).map((item, idx) => (
        <Fragment key={idx}>
          <ListItem className={classes.item} divider>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <Button
                  className={classes.avatarBtn}
                  onClick={() => {
                    handleOnClick(item.word);
                  }}>
                  詳細
                </Button>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item.word}
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
              secondary={item.vocabulary}
              secondaryTypographyProps={{
                variant: 'body2',
              }}
              className={classes.itemTextRoot}
            />
            {showDelete ? (
              <ListItemSecondaryAction>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    handleOnDelete(item.word);
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
  list: APIs.C002ResItem[];
  onDetail?: (word: string) => void;
  onDelete?: (word: string) => void;
  showDelete?: boolean;
}

export default list;
