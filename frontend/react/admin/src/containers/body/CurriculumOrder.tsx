import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import InputLabel from '@mui/material/InputLabel';
import BookIcon from '@mui/icons-material/Book';
import { UserActions } from '@actions';
import { RootState, Tables } from 'typings';
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { Consts } from '@constants';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;
const grpState = (state: RootState) => state.group;

// a little function to help us with reordering the result
const reorder = (list: Tables.TCurriculums[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default () => {
  const actions = bindActionCreators(UserActions, useDispatch());
  const { isLoading } = useSelector(appState);
  const { curriculums, activeStudent, students } = useSelector(userState);
  const { groups } = useSelector(grpState);
  const [subject, setSubject] = useState(Consts.SUBJECT.SOCIETY);
  const [student, setStudent] = useState(activeStudent);
  const [dataRows, setDataRows] = useState(
    curriculums.filter((item) => item.subject === Consts.SUBJECT.SOCIETY && item.userId === student)
  );

  useEffect(() => {
    const dataRows = curriculums.filter((item) => item.subject === Consts.SUBJECT.SOCIETY && item.userId === student);

    setDataRows(dataRows);

    // initialize
    setSubject(Consts.SUBJECT.SOCIETY);
    // initialize
    setStudent(activeStudent);
  }, [curriculums]);

  const handleDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(dataRows, result.source.index, result.destination.index);

    // save order results
    setDataRows(items);
  };

  const handleOnSubject = (e: SelectChangeEvent<string>) => {
    const subject = e.target.value;
    // set subject
    setSubject(subject);
    // set display rows
    setDataRows(curriculums.filter((item) => item.subject === subject && item.userId === student));
  };

  const handleOnStudent = (e: SelectChangeEvent<string>) => {
    const student = e.target.value;
    // set student
    setStudent(student);
    // set display rows
    setDataRows(curriculums.filter((item) => item.subject === subject && item.userId === student));
  };

  const handleUpdate = () => {
    const newDatas = dataRows.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    actions.curriculumOrder(newDatas, curriculums);
  };

  const color = (() => {
    switch (subject) {
      case Consts.SUBJECT.JAPANESE:
        return Consts.COLORS.JAPANESE;
      case Consts.SUBJECT.SOCIETY:
        return Consts.COLORS.SOCIETY;
      case Consts.SUBJECT.SCIENCE:
        return Consts.COLORS.SCIENCE;
      case Consts.SUBJECT.ENGLISH:
        return Consts.COLORS.ENGLISH;
      default:
        return Consts.COLORS.ENGLISH;
    }
  })();

  return (
    <Box sx={{ m: 2 }}>
      <Box display="flex">
        <FormControl sx={{ width: '40%', mr: 2 }}>
          <InputLabel id="subject-label">Subject</InputLabel>
          <Select labelId="subject-label" onChange={handleOnSubject} value={subject} label="Subject">
            <MenuItem value={Consts.SUBJECT.SCIENCE}>理 科</MenuItem>
            <MenuItem value={Consts.SUBJECT.SOCIETY}>社 会</MenuItem>
            <MenuItem value={Consts.SUBJECT.JAPANESE}>国 語</MenuItem>
            <MenuItem value={Consts.SUBJECT.ENGLISH}>英 語</MenuItem>
            <MenuItem value={Consts.SUBJECT.MATHS}>算 数</MenuItem>
            <MenuItem value={Consts.SUBJECT.HANDWRITING}>漢 字</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: '40%', mr: 2 }}>
          <InputLabel id="student-label">Student</InputLabel>
          <Select labelId="student-label" onChange={handleOnStudent} value={student} label="Student">
            {students.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          sx={{ width: '120px', mx: 2 }}
          loading={isLoading}
          variant="contained"
          color="primary"
          onClick={handleUpdate}
        >
          UPDATE
        </LoadingButton>
      </Box>
      {dataRows.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <List ref={provided.innerRef} sx={{ my: 2, border: 1 }}>
                {dataRows.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => {
                      const row = groups.find((g) => g.id === item.groupId);
                      return (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ py: 0 }}
                        >
                          <ListItemIcon>
                            <BookIcon sx={{ color: color }} />
                          </ListItemIcon>
                          <ListItemText primary={row?.name} />
                        </ListItem>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Box>
  );
};
