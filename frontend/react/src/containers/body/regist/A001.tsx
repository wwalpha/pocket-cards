import React, { FunctionComponent, useState } from 'react';
import * as Actions from '@actions/regist';
import Button from '@components/buttons/Button';
import WebCamera from '@components/WebCamera';
import { Theme, makeStyles, createStyles, Box } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'typings';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    root: {
      padding: `${spacing(2)}px 0px`,
    },
    item: {
      padding: `${spacing()}px 0px`,
    },
  })
);

const app = (state: RootState) => state.app;

const a001: FunctionComponent<any> = () => {
  const classes = useStyles();
  const { isLoading } = useSelector(app);
  const [onAir, setOnAir] = useState(false);
  const actions = bindActionCreators(Actions, useDispatch());

  const startCamera = () => setOnAir(true);
  const afterStopCamera = () => setOnAir(false);

  /** カメラ起動 */
  const handleCamera = (image: string) => actions.uploadImage(image);
  /** ファイルアップロードイベント */
  const handleImageUpload = () => {
    // カメラ停止
    afterStopCamera();

    const element = document.getElementById('uploadImage') as HTMLInputElement;

    if (!element) return;

    element.click();
  };

  /** ファイルアップロードイベント */
  const handleFileUpload = () => {
    // カメラ停止
    afterStopCamera();

    const element = document.getElementById('uploadFile') as HTMLInputElement;

    if (!element) return;

    element.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // ファイル選択なしか、クリアした
    if (!files || files.length === 0) {
      return;
    }

    const fr = new FileReader();

    fr.onload = (env: ProgressEvent) => {
      if (!env.target) return;

      const texts: string = (env.target as any).result;

      actions.uploadFile(texts);
    };

    fr.readAsDataURL(files[0]);
  };
  /** ファイルアップロード */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // ファイル選択なしか、クリアした
    if (!files || files.length === 0) {
      return;
    }

    const fr = new FileReader();

    fr.onload = (env: ProgressEvent) => {
      if (!env.target) return;

      const base64: string = (env.target as any).result;

      actions.uploadImage(base64);
    };

    fr.readAsDataURL(files[0]);
  };

  return (
    <Box display="flex" flexDirection="column" margin="8px 16px">
      <input type="file" id="uploadImage" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
      <input type="file" id="uploadFile" accept="*/*" style={{ display: 'none' }} onChange={handleFileChange} />

      <Button variant="contained" color="primary" fullWidth onClick={startCamera} size="large" isLoading={isLoading}>
        Take Photo
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleImageUpload}
        size="large"
        isLoading={isLoading}>
        Upload Photo
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleFileUpload}
        size="large"
        isLoading={isLoading}>
        Upload File
      </Button>
      <Box margin={1}>
        <WebCamera onAir={onAir} takePhoto={handleCamera} afterStopCamera={afterStopCamera} />
      </Box>
    </Box>
  );
};

export default a001;
