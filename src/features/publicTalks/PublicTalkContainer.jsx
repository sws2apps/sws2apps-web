import { useRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PublicTalkEditor from './PublicTalkEditor';
import { publicTalksListState } from '../../states/congregation';
import { LANGUAGE_LIST } from '../../constant/langList';
import { apiUpdatePublicTalk } from '../../api/congregation';

const PublicTalkContainer = ({ talk_number }) => {
  const [publicTalks, setPublicTalks] = useRecoilState(publicTalksListState);

  const publicTalk = publicTalks.find((record) => record.talk_number === talk_number);

  const handleSave = async (language, value) => {
    const currentTalk = talk_number;
    const modifDate = new Date().toISOString();
    language = language.toUpperCase();

    const { status } = await apiUpdatePublicTalk(language, currentTalk, value, modifDate);

    if (status === 200) {
      const newTalks = structuredClone(publicTalks);

      let foundTalk = newTalks.find((record) => record.talk_number === currentTalk);
      if (!foundTalk) {
        newTalks.push({ talk_number: currentTalk });
      }
      foundTalk = newTalks.find((record) => record.talk_number === currentTalk);
      foundTalk[language] = { title: value, modified: modifDate };

      newTalks.sort((a, b) => {
        return a.talk_number > b.talk_number ? 1 : -1;
      });

      setPublicTalks(newTalks);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <Typography
        sx={{
          backgroundColor: '#3f51b5',
          width: '80px',
          textAlign: 'right',
          fontSize: '25px',
          fontWeight: 'bold',
          color: 'white',
          padding: '0 10px',
          height: '40px',
          borderRadius: '5px',
        }}
      >
        {publicTalk.talk_number}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <PublicTalkEditor public_talk={publicTalk} handleSaveData={handleSave} language="E" />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {LANGUAGE_LIST.filter((lang) => !lang.isSource).map((language) => (
            <PublicTalkEditor
              language={language.code}
              key={language.code}
              public_talk={publicTalk}
              handleSaveData={handleSave}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PublicTalkContainer;
