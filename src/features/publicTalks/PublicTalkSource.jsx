import { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const PublicTalkSource = ({ isNew, handleSaveSource, public_talk }) => {
  const [isEdit, setIsEdit] = useState(isNew);
  const [source, setSource] = useState('');

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    if (isNew) setSource('');
    if (!isNew) setSource(public_talk.E?.title || '');
  };

  const handleSave = () => {
    handleSaveSource(source);
    setIsEdit(isNew ? true : false);
    setSource('');
  };

  useEffect(() => {
    if (isNew) setSource('');
    if (!isNew) setSource(public_talk.E?.title || '');
  }, [isNew, public_talk]);

  useEffect(() => {
    setIsEdit(isNew);
  }, [isNew]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <TextField
            label="Source"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{ readOnly: !isEdit }}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          {!isNew && public_talk.E && (
            <Typography
              align="right"
              sx={{ fontSize: '14px', marginTop: '8px', fontStyle: 'italic', marginRight: '10px' }}
            >
              {new Date(public_talk.E.modified).toLocaleString()}
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

export default PublicTalkSource;
