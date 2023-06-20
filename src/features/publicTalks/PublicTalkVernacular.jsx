import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const PublicTalkVernacular = ({ language, public_talk, handleSaveVernacular }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState('');

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSave = () => {
    handleSaveVernacular(language, title);
    setIsEdit(false);
  };

  useEffect(() => {
    setTitle(public_talk[language.toUpperCase()]?.title || '');
  }, [public_talk, language]);

  return (
    <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
      <Typography
        sx={{
          backgroundColor: '#3f51b5',
          width: '60px',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white',
          padding: '0 10px',
          height: '40px',
          lineHeight: '40px',
          borderRadius: '5px',
        }}
      >
        {language.toUpperCase()}
      </Typography>
      <Box sx={{ width: '100%' }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={title}
          InputProps={{ readOnly: !isEdit }}
          onChange={(e) => setTitle(e.target.value)}
        />
        {public_talk[language.toUpperCase()] && (
          <Typography
            align="right"
            sx={{ fontSize: '14px', marginTop: '8px', fontStyle: 'italic', marginRight: '10px' }}
          >
            {new Date(public_talk[language.toUpperCase()].modified).toLocaleString()}
          </Typography>
        )}
      </Box>
      {!isEdit && (
        <IconButton aria-label="edit" color="info" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
      )}
      {isEdit && (
        <IconButton aria-label="save" color="error" onClick={handleCancel}>
          <ClearIcon />
        </IconButton>
      )}
      {isEdit && (
        <IconButton aria-label="save" color="success" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default PublicTalkVernacular;
