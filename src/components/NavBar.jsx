import { cloneElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTheme } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ThemeSwitcher from '../features/themeSwitcher';
import { themeOptionsState } from '../states/theme';
import { isAdminState, isAppClosingState } from '../states/main';

const sharedStyles = {
  menuIcon: {
    borderRadius: '8px',
    '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
      borderRadius: 0,
      backgroundColor: 'rgba(23, 32, 42, .3)',
    },
  },
};

const ElevationScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

const NavBar = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const setIsAppClosing = useSetRecoilState(isAppClosingState);

  const themeOptions = useRecoilValue(themeOptionsState);
  const isAdmin = useRecoilValue(isAdminState);

  const mdUp = useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    setIsAppClosing(true);
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  return (
    <>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: themeOptions.mainColor,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: '50px !important',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Toolbar
            sx={{
              height: '50px !important',
              paddingLeft: '0px !important',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '40px',
              }}
            >
              <img
                src="./img/appLogo.png"
                alt="App Logo"
                onClick={handleGoDashboard}
                style={{
                  width: 'auto',
                  height: '50px',
                  borderRadius: '4px',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
              />
              <Typography noWrap sx={{ fontSize: '18px' }}>
                {smUp ? 'Scheduling Workbox System' : 'sws2apps app'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <ThemeSwitcher />

              {isAdmin && (
                <>
                  <IconButton
                    color="inherit"
                    edge="start"
                    sx={sharedStyles.menuIcon}
                    onClick={handleMenu}
                    id="button-account"
                    aria-controls={open ? 'menu-account' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    {smUp && (
                      <Box sx={{ marginRight: '5px' }}>
                        <Typography
                          sx={{
                            marginLeft: '5px',
                            textAlign: 'right',
                            fontSize: '12px',
                          }}
                        >
                          ADMIN
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: '5px',
                            textAlign: 'right',
                            fontSize: '12px',
                          }}
                        >
                          sws2apps
                        </Typography>
                      </Box>
                    )}
                    <AccountCircle sx={{ fontSize: '40px' }} />
                  </IconButton>
                  <Menu
                    sx={{ marginTop: '40px', '.MuiMenu-list': { minWidth: '200px !important' } }}
                    id="menu-account"
                    MenuListProps={{
                      'aria-labelledby': 'button-account',
                    }}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <PowerSettingsNewIcon fontSize="medium" sx={{ color: '#E74C3C' }} />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                    {!mdUp && (
                      <MenuItem disabled={true} sx={{ opacity: '1 !important' }}>
                        <Box
                          sx={{
                            borderTop: '1px outset',
                            paddingTop: '5px',
                            width: '100%',
                            minWidth: '200px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            sx={{
                              marginLeft: '5px',
                              textAlign: 'right',
                              fontSize: '12px',
                            }}
                          >
                            ADMIN
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: '5px',
                              textAlign: 'right',
                              fontSize: '12px',
                            }}
                          >
                            sws2apps
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
};

export default NavBar;
