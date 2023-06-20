import { useMemo } from 'react';
import Box from '@mui/material/Box';
import GroupIcon from '@mui/icons-material/Group';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuCard from '../components/MenuCard';

const DashboardMenu = () => {
  const dashboardMenus = useMemo(() => {
    return [
      {
        title: 'Congregations',
        links: [
          {
            title: 'Congregations',
            icon: <HomeWorkIcon />,
            navigateTo: '/congregations',
          },
          {
            title: 'Public Talks',
            icon: <ListAltIcon />,
            navigateTo: '/public-talks',
          },
        ],
      },
      {
        title: 'Users',
        links: [
          {
            title: 'Users',
            icon: <GroupIcon />,
            navigateTo: '/users',
          },
        ],
      },
    ];
  }, []);

  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {dashboardMenus.map((menu) => (
        <MenuCard key={`menu-item-${menu.title}`} menu={menu} />
      ))}
    </Box>
  );
};

export default DashboardMenu;
