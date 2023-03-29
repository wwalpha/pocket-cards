import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { ProgressActions } from '@actions';
import { Consts } from '@constants';
import { ChartUtils } from '@utils';
import { OverallProgressForm, RootState } from 'typings';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;
const groupState = (state: RootState) => state.group;
const progressState = (state: RootState) => state.progress;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options: ChartOptions<'bar'> = {
  indexAxis: 'y' as const,
  plugins: {
    title: { display: false },
  },
  responsive: true,
  scales: {
    x: { stacked: true },
    y: { stacked: true, position: 'right' },
  },
};

export default () => {
  const actions = bindActionCreators(ProgressActions, useDispatch());
  const { isLoading } = useSelector(appState);
  const { overalls } = useSelector(progressState);
  const { students, curriculums } = useSelector(userState);
  const { groups } = useSelector(groupState);

  const {
    control,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<OverallProgressForm>({
    defaultValues: {
      subject: '',
      student: '',
      curriculums: [],
    },
  });

  const onSubmit = handleSubmit(({ curriculums }) => {
    // 検索処理
    actions.overall(curriculums);
  });

  // 科目の選択を監視する
  watch('subject');

  const labels = overalls
    .map((item) => {
      const curriculum = curriculums.find((c) => c.id === item.id);
      const name = groups.find((g) => g.id === curriculum?.groupId)?.name;
      return name;
    })
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  const datas = [
    overalls.map((o) => o.progress[0]),
    overalls.map((o) => o.progress[1] + o.progress[2]),
    overalls.map((o) => o.progress[3]),
    overalls.map((o) => o.progress[4]),
    overalls.map((o) => o.progress[5]),
    overalls.map((o) => o.progress[6] + o.progress[7]),
    overalls.map((o) => o.progress[8] + o.progress[9]),
    overalls.map((o) => o.progress[10]),
  ];

  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      ChartUtils.getBarChartData('未学習', datas[0], 0),
      ChartUtils.getBarChartData('再学習', datas[1], 1),
      ChartUtils.getBarChartData('1回', datas[2], 2),
      ChartUtils.getBarChartData('2回', datas[3], 3),
      ChartUtils.getBarChartData('3回', datas[4], 4),
      ChartUtils.getBarChartData('4~5回', datas[5], 5),
      ChartUtils.getBarChartData('6~7回', datas[6], 6),
      ChartUtils.getBarChartData('8回以上', datas[7], 7),
    ],
  };

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
                <MenuItem value={Consts.SUBJECT.ENGLISH}>英 語</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="curriculums"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ mx: 1, width: '360px', maxWidth: '50%' }} fullWidth size="small">
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
      {labels.length > 0 && (
        <Paper sx={{ py: 2, mx: 1, maxHeight: '550px' }}>
          <Bar options={options} data={data} style={{ padding: '0 32px' }} />
        </Paper>
      )}
    </form>
  );
};
