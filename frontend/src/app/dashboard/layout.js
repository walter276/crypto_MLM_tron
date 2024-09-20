'use client';

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';

import {
  WalletDisconnectedError,
  WalletNotFoundError,
} from '@tronweb3/tronwallet-abstract-adapter';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import {
  BitKeepAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
  TronLinkAdapter,
} from '@tronweb3/tronwallet-adapters';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';
import { LedgerAdapter } from '@tronweb3/tronwallet-adapter-ledger';

import '@tronweb3/tronwallet-adapter-react-ui/style.css';
// components
import DashboardLayout from 'src/layouts/dashboard';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const { enqueueSnackbar } = useSnackbar();
  const onError = (e) => {
    console.log('2222222222222222', e);
    if (e instanceof WalletNotFoundError) {
      enqueueSnackbar(e.message, { variant: 'error' });
    } else if (e instanceof WalletDisconnectedError) {
      enqueueSnackbar(e.message, { variant: 'error' });
    } else enqueueSnackbar(e.message, { variant: 'error' });
  };
  const adapters = useMemo(() => {
    const tronLinkAdapter = new TronLinkAdapter();
    const walletConnectAdapter = new WalletConnectAdapter({
      network: 'Nile',
      options: {
        relayUrl: 'wss://relay.walletconnect.com',
        // example WC app project ID
        projectId: '5fc507d8fc7ae913fff0b8071c7df231',
        metadata: {
          name: 'Test DApp',
          description: 'JustLend WalletConnect',
          url: 'https://your-dapp-url.org/',
          icons: ['https://your-dapp-url.org/mainLogo.svg'],
        },
      },
      web3ModalConfig: {
        themeMode: 'dark',
        themeVariables: {
          '--w3m-z-index': '1000',
        },
      },
    });
    const ledger = new LedgerAdapter({
      accountNumber: 2,
    });
    const bitKeepAdapter = new BitKeepAdapter();
    const tokenPocketAdapter = new TokenPocketAdapter();
    const okxwalletAdapter = new OkxWalletAdapter();
    return [
      tronLinkAdapter,
      bitKeepAdapter,
      tokenPocketAdapter,
      okxwalletAdapter,
      walletConnectAdapter,
      ledger,
    ];
  }, []);

  return (
    // <AuthGuard>
    <WalletProvider onError={onError} autoConnect disableAutoConnectOnLoad adapters={adapters}>
      <WalletModalProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </WalletModalProvider>
    </WalletProvider>

    // </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
