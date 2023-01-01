import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import CongregationMemberRole from './CongregationMemberRole';
import Accordion from '../../components/Accordion';
import AccordionDetails from '../../components/AccordionDetails';
import AccordionSummary from '../../components/AccordionSummary';

const CongregationMember = ({ member }) => {
  const [expanded, setExpanded] = useState(false);
  const [tmpUser, setTmpUser] = useState(member);

  const handleChange = () => {
    setExpanded((prev) => {
      return !prev;
    });
  };

  useEffect(() => {
    setTmpUser(member);
  }, [member]);

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary aria-controls="paneld-content" id="paneld-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {member.global_role === 'vip' ? (
            <PersonIcon color="primary" sx={{ fontSize: '40px' }} />
          ) : (
            <GradeIcon color="secondary" sx={{ fontSize: '40px' }} />
          )}
          <Typography>{member.username}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <CongregationMemberRole user={member} tmpUser={tmpUser} setTmpUser={(value) => setTmpUser(value)} />
      </AccordionDetails>
    </Accordion>
  );
};

export default CongregationMember;
