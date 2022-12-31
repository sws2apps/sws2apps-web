import AddCircleIcon from '@mui/icons-material/AddCircle';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MailIcon from '@mui/icons-material/Mail';
import MenuCard from '../components/MenuCard';

const DashboardMenu = () => {
  const dashboardMenus = [
    {
      title: 'Announcements',
      links: [
        {
          title: 'Announcements List',
          icon: <CampaignIcon />,
          navigateTo: '/announcements',
        },
        {
          title: 'Create New Announcement',
          icon: <AddCircleIcon />,
          navigateTo: '/announcements/new',
        },
      ],
    },
    {
      title: 'Congregations',
      links: [
        {
          title: 'Congregation Requests',
          icon: (
            <Badge color="secondary" badgeContent={12} showZero>
              <MailIcon />
            </Badge>
          ),
          action: () => console.log('ok'),
        },
        {
          title: 'Congregations',
          icon: <HomeWorkIcon />,
          action: () => console.log('ok'),
        },
      ],
    },
    {
      title: 'Users',
      links: [
        {
          title: 'Users',
          icon: <GroupIcon />,
          action: () => console.log('ok'),
        },
      ],
    },
  ];

  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {dashboardMenus.map((menu) => (
        <MenuCard key={`menu-item-${menu.title}`} menu={menu} />
      ))}
    </Box>
  );
};

export default DashboardMenu;
