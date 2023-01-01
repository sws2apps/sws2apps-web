import { useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MailIcon from '@mui/icons-material/Mail';
import MenuCard from '../components/MenuCard';
import { apiFetchCongregationRequests } from '../utils/api';
import { congregationRequestsState, countCongregationRequestsState } from '../states/congregation';

const DashboardMenu = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['congregationRequests'],
    queryFn: apiFetchCongregationRequests,
  });

  const setCongregationRequests = useSetRecoilState(congregationRequestsState);

  const countCongregationRequests = useRecoilValue(countCongregationRequestsState);

  const dashboardMenus = useMemo(() => {
    return [
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
              <Badge color="secondary" badgeContent={countCongregationRequests} showZero>
                <MailIcon />
              </Badge>
            ),
            navigateTo: '/congregations/requests',
          },
          {
            title: 'Congregations',
            icon: <HomeWorkIcon />,
            navigateTo: '/congregations',
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
  }, [countCongregationRequests]);

  useEffect(() => {
    if (!isLoading) setCongregationRequests(data);
  }, [isLoading, data, setCongregationRequests]);

  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {dashboardMenus.map((menu) => (
        <MenuCard key={`menu-item-${menu.title}`} menu={menu} />
      ))}
    </Box>
  );
};

export default DashboardMenu;
