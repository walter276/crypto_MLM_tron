// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useSettingsContext } from 'src/components/settings';
import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();
  const settings = useSettingsContext();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        {/* <Logo sx={{ mx: 'auto', my: 2 }} /> */}
        <Stack sx={{ alignSelf: 'center', marginTop: '10px' }}>
          {settings.themeMode === 'light' ? (
            <Box
              component="img"
              src="/logo/logo22.png"
              sx={{ width: 80, height: 80, cursor: 'pointer' }}
            />
          ) : (
            <Box
              component="img"
              src="/logo/logo11.png"
              sx={{ width: 80, height: 80, cursor: 'pointer' }}
            />
          )}
        </Stack>

        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.role || 'admin',
          }}
        />
      </Stack>
    </Box>
  );
}
