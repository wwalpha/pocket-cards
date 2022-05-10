import React, { FunctionComponent } from 'react';
import { ButtonProps } from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const button: FunctionComponent<Props> = ({ readAsText, readAsDataURL, children, ...props }) => {
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

      readAsText && readAsText(texts);
      readAsDataURL && readAsDataURL(texts);
    };

    readAsText && fr.readAsText(files[0]);
    readAsDataURL && fr.readAsDataURL(files[0]);
  };
  return (
    <label htmlFor="uploadFile">
      <input type="file" id="uploadFile" accept="*/*" style={{ display: 'none' }} onChange={handleFileChange} />
      <LoadingButton variant="contained" sx={{ width: 120, mr: 1 }} component="span" {...props}>
        Upload
      </LoadingButton>
    </label>
  );
};

interface Props extends ButtonProps {
  readAsText?: (text: string) => void;
  readAsDataURL?: (text: string) => void;
  loading?: boolean;
}

export default button;
