'use client';

import { useState, useEffect, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { contractAddress, usdtAddress, ticketPrice, API_URL } from '../../utils/constant';
import { validateTronAdddress } from '../../utils/utils';
import MLM_ABI from '../../utils/abi/mlm.json';
import USDT_ABI from '../../utils/abi/usdt.json';

// ----------------------------------------------------------------------

export default function WithdrawView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { address, connected, wallet, signTransaction } = useWallet();
  const [availAmount, setAvailAmount] = useState(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      reffererAddress: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  useEffect(() => {
    let unmounted = false;
    (async () => {
      if (address) {
        let instance = await window.tronWeb.contract(MLM_ABI, contractAddress);
        const user = await instance.getUser(address).call();
        const owner = await instance.owner().call();
        const recipientWallet = await instance.receiptWallet().call();
        console.log('ddd', owner);
        if (window.tronWeb.address.toHex(address) !== recipientWallet && !unmounted) {
          const availableAmount = user.referralCommission - user.withdrawnReward;
          setAvailAmount(availableAmount);
        }
        if (window.tronWeb.address.toHex(address) === recipientWallet && !unmounted) {
          instance = await window.tronWeb.contract(USDT_ABI, usdtAddress);
          const availableAmount = await instance.balanceOf(contractAddress).call();
          // const availableAmountUser = user.referralCommission - user.withdrawnReward;
          console.log('3333333', availableAmount);
          // setAvailAmount(Number(availableAmount) + Number(availableAmountUser));
          setAvailAmount(Number(availableAmount));
        }
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [address, isWithdrawing]);

  const onSubmit = handleSubmit(async () => {
    try {
      if (address && availAmount > 0) {
        const data1 = { walletAddress: address };
        await fetch(`${API_URL}/api/getUserByWalletAddress`, {
          method: 'POST',
          body: JSON.stringify(data1),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(async (data) => {
            console.log(data);
            if (data.type === 'failed') {
              enqueueSnackbar('Please register to use', { variant: 'error' });
            } else {
              setIsWithdrawing(true);
              const instance = await window.tronWeb.contract(MLM_ABI, contractAddress);
              let res;
              const user = await instance.getUser(address).call();
              const owner = await instance.owner().call();
              const recipientWallet = await instance.receiptWallet().call();

              if (window.tronWeb.address.toHex(address) !== recipientWallet && availAmount > 0) {
                // if (availAmount > 0) {
                res = await instance.withdrawReward().send({
                  feeLimit: 100_000_000,
                  callValue: 0,
                  shouldPollResponse: true,
                });
                console.log('111111', res);
                if (res?.error) {
                  enqueueSnackbar('Error occured.', { variant: 'error' });
                } else {
                  enqueueSnackbar('Withdraw is successful.');
                }
                setIsWithdrawing(false);
              }
              if (window.tronWeb.address.toHex(address) === recipientWallet) {
                // res = await instance.withdrawForOwner().send({
                //   feeLimit: 100_000_000,
                //   callValue: 0,
                //   shouldPollResponse: true,
                // });
                if (availAmount > 0) {
                  res = await instance.withdrawForRecipient().send({
                    feeLimit: 100_000_000,
                    callValue: 0,
                    shouldPollResponse: true,
                  });
                }
                console.log('111111', res);
                if (res?.error) {
                  enqueueSnackbar('Error occured.', { variant: 'error' });
                } else {
                  enqueueSnackbar('Withdraw is successful.');
                }
                setIsWithdrawing(false);
              }
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured.', { variant: 'error' });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ marginBottom: '10px' }}>
          {' '}
          Withdraw{' '}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 6 }}>
              <Stack sx={{ alignItems: 'center' }}>
                <Stack direction="row" spacing={2}>
                  <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                    Available amount:
                  </Box>
                  {availAmount / 1000000} USDT
                </Stack>
              </Stack>

              <Stack alignItems="flex-end" sx={{ mt: 3, alignItems: 'center' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Withdraw
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
