import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const UserActionConfirmation = ({ title, content, confirmOpen, setConfirmOpen, callback }) => {
  return (
    <Box>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px', lineHeight: 1.2 }}>{title}</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ lineHeight: 1.2 }}>{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={() => callback.action()} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserActionConfirmation;
