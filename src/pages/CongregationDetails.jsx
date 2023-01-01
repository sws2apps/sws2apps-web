import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CongregationMember } from '../features/congregations';

const CongregationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const query = queryClient.getQueryData(['congregations']);
  const congregation = query?.find((congregation) => congregation.id === id);
  const cong_members = congregation.cong_members;

  const handleBackCongregations = () => {
    navigate('/congregations');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <IconButton onClick={handleBackCongregations}>
          <ArrowCircleLeftIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Congregation Details</Typography>
      </Box>

      <Box sx={{ marginTop: '10px', padding: '10px' }}>
        <Typography sx={{ fontWeight: 'bold' }}>Members ({cong_members.length})</Typography>
        <Box sx={{ marginTop: '20px' }}>
          {cong_members.length > 0 &&
            cong_members.map((member) => <CongregationMember key={member.id} member={member} />)}
        </Box>
      </Box>
    </Box>
  );
};

export default CongregationDetails;
