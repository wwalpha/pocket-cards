import React, { FunctionComponent, useState, Fragment } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@components/inputs';

const edit: FunctionComponent<WordEditProps> = ({ word, onDelete }) => {
  const [isEdit, setEdit] = useState(false);

  const handleOnDelete = () => onDelete(word);

  const handleEdit = () => setEdit(true);

  return (
    <ListItem dense sx={{ pl: 0.5, pr: 1 }}>
      {isEdit && <TextField value={word} fullWidth />}
      {!isEdit && (
        <Fragment>
          <ListItemText
            primary={word}
            primaryTypographyProps={{
              variant: 'h5',
            }}
            sx={{ p: 0, pt: 2, pb: 1, fontSize: '1.5rem' }}
          />
          <ListItemSecondaryAction
            sx={{
              top: ({ spacing }) => spacing(0),
              right: ({ spacing }) => spacing(0),
              position: 'inherit',
              transform: 'none',
              display: 'flex',
              alignItems: 'center',
            }}>
            <DeleteIcon fontSize="large" sx={{ color: 'secondary.light' }} onClick={handleOnDelete} />
          </ListItemSecondaryAction>
        </Fragment>
      )}
    </ListItem>
  );
};

interface WordEditProps {
  word: string;
  onDelete: (word: string) => void;
  onEdit?: (word: string) => void;
}

export default edit;
