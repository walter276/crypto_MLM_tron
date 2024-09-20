import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import {
  WalletActionButton,
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModalProvider,
  WalletSelectButton,
} from '@tronweb3/tronwallet-adapter-react-ui';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Icon } from '@iconify/react';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
//
import { HEADER, NAV } from '../config-layout';
import {
  Searchbar,
  AccountPopover,
  SettingsButton,
  LanguagePopover,
  ContactsPopover,
  NotificationsPopover,
} from '../_common';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const { address, connected, wallet, signTransaction } = useWallet();

  const [hasIcon, setHasIcon] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    if (document.querySelector('.adapter-react-button .button-icon img')) {
      setHasIcon(true);
    } else {
      setHasIcon(false);
    }
  });
  /* eslint-enable */

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          '& .adapter-react-button ': {
            // backgroundColor: theme.palette.background.default,
            backgroundColor: '#0AADB4',
            borderRadius: '20px',
            // color: theme.palette.text.primary,
          },
          '& .adapter-react-button:not([disabled]):hover ': {
            backgroundColor: '#09A994',
          },
        }}
      >
        {/* <LanguagePopover /> */}

        {/* <NotificationsPopover /> */}

        {/* <ContactsPopover /> */}

        <SettingsButton />
        <WalletActionButton>
          {!hasIcon && (
            <Icon
              icon="solar:wallet-outline"
              color="gold"
              width={30}
              height={30}
              style={{ marginRight: '5px' }}
            />
          )}

          {address
            ? `${address?.slice(0, 8)}...${address.slice(address.length - 8, address.length)}`
            : 'Connect/Select Wallet'}
        </WalletActionButton>
        {/* <AccountPopover /> */}
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        // zIndex: theme.zIndex.appBar + 1,
        zIndex: 999,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
