import { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const PublicTalkEditor = ({ isNew, handleSaveData, public_talk, language }) => {
  const [isEdit, setIsEdit] = useState(isNew);
  const [title, setTitle] = useState('');

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    if (isNew) setTitle('');
    if (!isNew) setTitle(public_talk[language.toUpperCase()]?.title || '');
  };

  const handleSave = () => {
    handleSaveData(title);
    setIsEdit(isNew ? true : false);
    setTitle('');
  };

  useEffect(() => {
    if (isNew) setTitle('');
    if (!isNew) setTitle(public_talk[language.toUpperCase()]?.title || '');
  }, [isNew, public_talk, language]);

  useEffect(() => {
    setIsEdit(isNew);
  }, [isNew]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
        {language !== 'E' && (
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
        )}
        <Box sx={{ width: '100%' }}>
          <TextField
            label="Source"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{ readOnly: !isEdit }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {!isNew && public_talk[language] && (
            <Typography
              align="right"
              sx={{ fontSize: '14px', marginTop: '8px', fontStyle: 'italic', marginRight: '10px' }}
            >
              {new Date(public_talk[language].modified).toLocaleString()}
            </Typography>
          )}
        </Box>

        {!isEdit && (
          <IconButton aria-label="edit" color="info" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        )}
        {isEdit && !isNew && (
          <IconButton aria-label="save" color="error" onClick={handleCancel}>
            <ClearIcon />
          </IconButton>
        )}
        {isEdit && (
          <IconButton aria-label="save" color="success" onClick={handleSave}>
            {isNew && <AddCircleIcon />}
            {!isNew && <CheckIcon />}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default PublicTalkEditor;
