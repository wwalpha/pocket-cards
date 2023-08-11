import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { StudyActions } from '@actions';
import { Consts } from '@constants';
import { MultiTestForm, RootState } from 'typings';
import Modal from '@mui/material/Modal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const studyState = (state: RootState) => state.study;
const userState = (state: RootState) => state.user;
const appState = (state: RootState) => state.app;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export default () => {
  const actions = bindActionCreators(StudyActions, useDispatch());
  const [incorrect, setIncorrect] = React.useState(false);
  const [qImageOpen, setQImageOpen] = React.useState(false);
  const [aImageOpen, setAImageOpen] = React.useState(false);
  const { isLoading, isConnecting, isConnectionEstablished } = useSelector(appState);
  const { questions, index, searchConditions, isOnline, correctCount, incorrectCount } = useSelector(studyState);
  const { students } = useSelector(userState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MultiTestForm>({
    defaultValues: {
      subject: '',
      userId: '',
      review: false,
    },
  });

  useEffect(() => {
    // 接続切断後、画面設定値初期化
    if (isConnectionEstablished === false) {
      setIncorrect(false);
    }
  }, [isConnectionEstablished]);

  const onFailure = () => {
    actions.failure();
    // set status
    setIncorrect(true);
  };

  const onCorrect = () => {
    actions.correct();

    // set status
    setIncorrect(false);
  };

  const onNext = () => {
    actions.goNext();
    // set status
    setIncorrect(false);
  };

  const onSubmit = handleSubmit(async ({ userId, subject, review }) => {
    actions.dailyTest(userId, subject, review);
  });

  const handleImageOpen = (position: number) => {
    // question
    if (position === 0) setQImageOpen(true);
    // answer
    if (position === 1) setAImageOpen(true);
  };
  const handleImageClose = (position: number) => {
    // question
    if (position === 0) setQImageOpen(false);
    // answer
    if (position === 1) setAImageOpen(false);
  };

  return (
    <form onSubmit={onSubmit}>
      {!isConnectionEstablished && (
        <Box display="flex" sx={{ py: 2 }}>
          <Controller
            name="userId"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <FormControl sx={{ mx: 2, width: '35%' }} fullWidth size="small">
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
              <FormControl sx={{ mx: 2, width: '35%' }} fullWidth size="small">
                <InputLabel>科目 *</InputLabel>
                <Select label="Subject *" onChange={onChange} value={value} fullWidth>
                  <MenuItem value={Consts.SUBJECT.SCIENCE}>理 科</MenuItem>
                  <MenuItem value={Consts.SUBJECT.SOCIETY}>社 会</MenuItem>
                  <MenuItem value={Consts.SUBJECT.JAPANESE}>国 語</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="review"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={value} onChange={onChange} />} label="復習" />
              </FormGroup>
            )}
          />
          <LoadingButton
            type="submit"
            sx={{ width: '120px', mx: 2 }}
            loading={isLoading || isConnecting}
            variant="contained"
            color="primary"
          >
            接続
          </LoadingButton>
        </Box>
      )}
      {isConnectionEstablished && (
        <React.Fragment>
          <Box display="flex" alignItems="center" sx={{ mt: 2, mr: 1 }}>
            <Box display="flex" sx={{ px: 2 }}>
              {searchConditions.student}: <LightbulbIcon sx={{ ml: 2, color: isOnline === true ? 'green' : 'red' }} />
            </Box>
            <Box display="flex" sx={{ px: 2 }}>
              正解数：{correctCount}
            </Box>
            <Box display="flex" sx={{ px: 2 }}>
              不正解数：{incorrectCount}
            </Box>

            <Box position="fixed" display="flex" flexGrow="1" justifyContent="flex-end" right="0">
              <LoadingButton
                sx={{ width: '120px', mx: 1 }}
                loading={isLoading}
                variant="contained"
                color="primary"
                onClick={onNext}
                disabled={!isOnline}
              >
                次へ
              </LoadingButton>
              <LoadingButton
                sx={{ width: '120px', mx: 1 }}
                loading={isLoading}
                variant="contained"
                color="primary"
                onClick={onFailure}
                disabled={!isOnline}
              >
                不正解
              </LoadingButton>
              <LoadingButton
                sx={{ width: '120px', mx: 1 }}
                loading={isLoading}
                variant="contained"
                color="secondary"
                onClick={onCorrect}
                disabled={incorrect || !isOnline}
              >
                正解
              </LoadingButton>
            </Box>
          </Box>

          {questions.length === 0 && (
            <Box display="flex" justifyContent="center">
              データありません
            </Box>
          )}
          {questions.length !== 0 && (
            <Box display="flex" flexDirection="column" sx={{ my: 1, mx: 2 }}>
              <Paper elevation={3} sx={{ my: 1, p: 4 }}>
                {questions[index].title.replace(/\[.*\]/g, '')}
                {(() => {
                  const title = questions[index].title;
                  // 画像がない
                  if (!title.match(/\[.*\]/g)) return;

                  const startIdx = title.indexOf('[');
                  const endIdx = title.indexOf(']', startIdx);
                  const url = title.substring(startIdx + 1, endIdx);

                  return [
                    <img
                      src={`${Consts.DOMAIN_HOST}/${url}`}
                      width="200"
                      height="200"
                      onClick={() => {
                        handleImageOpen(0);
                      }}
                    />,
                    <Modal
                      open={qImageOpen}
                      onClose={() => {
                        handleImageClose(0);
                      }}
                    >
                      <Box sx={style}>
                        <img src={`${Consts.DOMAIN_HOST}/${url}`} width="100%" height="100%" />
                      </Box>
                    </Modal>,
                  ];
                })()}
              </Paper>
              {questions[index].choices === undefined && (
                <Paper elevation={3} sx={{ my: 1, p: 4 }}>
                  {questions[index].answer.replace(/\[.*\]/g, '')}
                  {(() => {
                    const answer = questions[index].answer;
                    // 画像がない
                    if (!answer.match(/\[.*\]/g)) return;

                    const startIdx = answer.indexOf('[');
                    const endIdx = answer.indexOf(']', startIdx);
                    const url = answer.substring(startIdx + 1, endIdx);

                    return [
                      <img
                        src={`${Consts.DOMAIN_HOST}/${url}`}
                        width="auto"
                        height="auto"
                        style={{ maxWidth: '100%' }}
                        onClick={() => {
                          handleImageOpen(1);
                        }}
                      />,
                      <Modal
                        open={aImageOpen}
                        onClose={() => {
                          handleImageClose(1);
                        }}
                      >
                        <Box sx={style}>
                          <img src={`${Consts.DOMAIN_HOST}/${url}`} width="100%" height="100%" />
                        </Box>
                      </Modal>,
                    ];
                  })()}
                </Paper>
              )}
              {questions[index].choices !== undefined && (
                <Paper elevation={3} sx={{ my: 1, p: 4 }}>
                  {questions[index].choices?.map((choiceItems, idx) => (
                    <Box color={questions[index].answer === (idx + 1).toString() ? 'blue' : 'black'}>
                      {idx + 1}. {choiceItems}
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>
          )}
        </React.Fragment>
      )}
    </form>
  );
};
