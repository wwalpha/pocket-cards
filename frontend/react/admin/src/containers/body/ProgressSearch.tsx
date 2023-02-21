import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { ProgressActions } from '@actions';
import { Consts } from '@constants';
import { ProgressSearchForm, RootState } from 'typings';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;
const groupState = (state: RootState) => state.group;
const progressState = (state: RootState) => state.progress;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default () => {
  const actions = bindActionCreators(ProgressActions, useDispatch());
  const { isLoading } = useSelector(appState);
  const { searchResults } = useSelector(progressState);
  const { students, curriculums } = useSelector(userState);
  const { groups } = useSelector(groupState);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const popoverOpen = Boolean(anchorEl);
  const [popoverValue, setPopoverValue] = React.useState<string | undefined>(undefined);

  const {
    control,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgressSearchForm>({
    defaultValues: {
      subject: '',
      student: '',
      curriculums: [],
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });

  const onSubmit = handleSubmit(({ curriculums, startDate, endDate }) => {
    actions.search(curriculums, (startDate as any)?.format('YYYYMMDD'), (endDate as any)?.format('YYYYMMDD'));

    // 再検索の場合、初期値に戻る
    setPage(0);
    setRowsPerPage(50);
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, value?: string) => {
    setAnchorEl(event.currentTarget);
    setPopoverValue(value);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // 科目の選択を監視する
  watch('subject');

  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" sx={{ py: 2 }}>
        <Controller
          name="student"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ mx: 1, width: '160px' }} fullWidth size="small">
              <InputLabel>学生 *</InputLabel>
              <Select label="Student *" value={value} onChange={onChange} disabled={students.length === 0}>
                {students.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="subject"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ mx: 1, width: '160px' }} fullWidth size="small">
              <InputLabel>科目 *</InputLabel>
              <Select
                label="Subject *"
                onChange={(e) => {
                  onChange(e);
                  setValue('curriculums', []);
                }}
                value={value}
                fullWidth
              >
                <MenuItem value={Consts.SUBJECT.SCIENCE}>理 科</MenuItem>
                <MenuItem value={Consts.SUBJECT.SOCIETY}>社 会</MenuItem>
                <MenuItem value={Consts.SUBJECT.JAPANESE}>国 語</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DesktopDatePicker
              label="Start"
              value={value}
              onChange={onChange}
              renderInput={(params) => <TextField {...params} size="small" sx={{ mx: 1, width: '160px' }} />}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DesktopDatePicker
              label="End"
              value={value}
              onChange={onChange}
              renderInput={(params) => <TextField {...params} size="small" sx={{ mx: 1, width: '160px' }} />}
            />
          )}
        />
        <Controller
          name="curriculums"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ mx: 1, width: '460px', maxWidth: '50%' }} fullWidth size="small">
              <InputLabel>カリキュラム *</InputLabel>
              <Select
                label="Curriculum *"
                multiple
                onChange={onChange}
                value={value}
                fullWidth
                disabled={getValues('subject') === ''}
                renderValue={(selected) =>
                  selected
                    .map((item) => {
                      const curriculum = curriculums.find((c) => c.id === item);
                      const name = groups.find((g) => g.id === curriculum?.groupId)?.name;

                      return name;
                    })
                    .join(', ')
                }
              >
                {curriculums
                  .filter((item) => item.userId === getValues('student'))
                  .filter((item) => item.subject === getValues('subject'))
                  .map((item) => (
                    <MenuItem key={item.id} value={item.id} sx={{ py: 0 }}>
                      <Checkbox checked={value.indexOf(item.id) > -1} size="small" />
                      <ListItemText primary={groups.find((g) => g.id === item.groupId)?.name} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />
        <LoadingButton
          type="submit"
          sx={{ width: '120px', mx: 2 }}
          loading={isLoading}
          variant="contained"
          color="primary"
        >
          検 索
        </LoadingButton>
      </Box>
      {(() => {
        if (searchResults.length === 0) {
          return;
        }

        return (
          <Paper sx={{ px: 2 }}>
            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 216px)' }}>
              <Table aria-label="customized table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 32 }}>No.</StyledTableCell>
                    <StyledTableCell sx={{ width: 200 }}>カリキュラム</StyledTableCell>
                    <StyledTableCell sx={{ width: 64 }}>解答回数</StyledTableCell>
                    <StyledTableCell>問題</StyledTableCell>
                    <StyledTableCell sx={{ width: 64 }}>正解率</StyledTableCell>
                    <StyledTableCell sx={{ width: 128 }}>次回学習日</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, idx) => (
                    <TableRow hover key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {(() => {
                          const name = groups.find((g) => g.id === item.gid)?.name;

                          return (
                            <Typography
                              sx={{
                                width: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
                              aria-haspopup="true"
                              onMouseEnter={(e) => {
                                handlePopoverOpen(e, name);
                              }}
                              onMouseLeave={handlePopoverClose}
                            >
                              {name}
                            </Typography>
                          );
                        })()}
                      </TableCell>
                      <TableCell>{item.times}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            width: '560px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
                          aria-haspopup="true"
                          onMouseEnter={(e: any) => {
                            handlePopoverOpen(e, item.question);
                          }}
                          onMouseLeave={handlePopoverClose}
                        >
                          {item.question}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.accuracy}</TableCell>
                      <TableCell>{dayjs(item.nextTime, 'YYYYMMDD').format('YYYY/MM/DD')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {searchResults.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={searchResults.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: 'none',
              }}
              open={popoverOpen}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography sx={{ p: 1 }}>{popoverValue}</Typography>
            </Popover>
          </Paper>
        );
      })()}
    </form>
  );
};
