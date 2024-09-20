'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import { yupResolver } from '@hookform/resolvers/yup';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import LoadingButton from '@mui/lab/LoadingButton';

import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// components
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

import { contractAddress, usdtAddress, ticketPrice, API_URL } from '../../utils/constant';
import { validateTronAdddress } from '../../utils/utils';
import MLM_ABI from '../../utils/abi/mlm.json';
import USDT_ABI from '../../utils/abi/usdt.json';
// ----------------------------------------------------------------------

export default function ChangeOwnerView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { address, connected, wallet, signTransaction } = useWallet();
  const [isOwner, setIsOwner] = useState(false);
  const [commissionWallet, setCommissionWallet] = useState('');
  const [recipientWallet, setRecipientWallet] = useState('');

  const NewUserSchema = Yup.object().shape({});

  const defaultValues1 = useMemo(
    () => ({
      newCommissionAddress: '',
    }),
    []
  );

  const defaultValues2 = useMemo(
    () => ({
      newRecipientAddress: '',
    }),
    []
  );

  const methods1 = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues1,
  });

  const methods2 = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues2,
  });

  const {
    reset: reset1,
    watch: watch1,
    control: control1,
    setValue: setValue1,
    setError: setError1,
    handleSubmit: handleSubmit1,
    formState: { isSubmitting: isSubmitting1 },
  } = methods1;

  const {
    reset: reset2,
    watch: watch2,
    control: control2,
    setValue: setValue2,
    setError: setError2,
    handleSubmit: handleSubmit2,
    formState: { isSubmitting: isSubmitting2 },
  } = methods2;

  const values1 = watch1();
  const values2 = watch2();

  useEffect(() => {
    let unmounted = false;
    (async () => {
      if (address) {
        const instance = await window.tronWeb.contract(MLM_ABI, contractAddress);
        const user = await instance.getUser(address).call();
        const owner = await instance.owner().call();

        const commissionWallet1 = await instance.commissionWallet().call();
        const recipientWallet1 = await instance.receiptWallet().call();

        if (window.tronWeb.address.toHex(address) === owner && !unmounted) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }

        if (!unmounted) {
          setCommissionWallet(window.tronWeb.address.fromHex(commissionWallet1));
          setRecipientWallet(window.tronWeb.address.fromHex(recipientWallet1));
        }
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [address, isSubmitting1, isSubmitting2]);

  const onSubmit1 = handleSubmit1(async () => {
    if (!isOwner) {
      enqueueSnackbar('you have not permission.', { variant: 'error' });
      return;
    }
    const validAddress = await validateTronAdddress(values1.newCommissionAddress);
    if (validAddress) {
      try {
        if (address) {
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
                const instance = await window.tronWeb.contract(MLM_ABI, contractAddress);

                const res = await instance
                  .changeCommissionWallet(values1.newCommissionAddress)
                  .send({
                    feeLimit: 100_000_000,
                    callValue: 0,
                    shouldPollResponse: true,
                  });

                // if (res?.error) {
                //   enqueueSnackbar('Error occured.', { variant: 'error' });
                // } else {
                enqueueSnackbar('Commission wallet is changed successfully.');
                // }

                // }
              }
            })
            .catch((error) => {
              enqueueSnackbar('Error occured.', { variant: 'error' });
            });
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('New commission wallet address is not correct.', { variant: 'error' });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    reset1();
  });

  const onSubmit2 = handleSubmit2(async () => {
    if (!isOwner) {
      enqueueSnackbar('you have not permission.', { variant: 'error' });
      return;
    }

    const validAddress = await validateTronAdddress(values2.newRecipientAddress);
    if (validAddress) {
      try {
        if (address) {
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
                const instance = await window.tronWeb.contract(MLM_ABI, contractAddress);

                const res = await instance.changeReceiptWallet(values2.newRecipientAddress).send({
                  feeLimit: 100_000_000,
                  callValue: 0,
                  shouldPollResponse: true,
                });

                // if (res?.error) {
                //   enqueueSnackbar('Error occured.', { variant: 'error' });
                // } else {
                enqueueSnackbar('recipient wallet is changed successfully.');
                // }

                // }
              }
            })
            .catch((error) => {
              enqueueSnackbar('Error occured.', { variant: 'error' });
            });
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('New recipient wallet address is not correct.', { variant: 'error' });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    reset2();
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ marginBottom: '10px' }}>
        {' '}
        Change Wallet Address{' '}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 6 }}>
            <Stack
              direction="column"
              justifyContent="center"
              sx={{ alignItems: 'center' }}
              spacing={4}
            >
              <Stack direction="row">
                <Box component="span" sx={{ color: 'text.secondary', width: 240, flexShrink: 0 }}>
                  Commission wallet address:
                </Box>
                {commissionWallet}
              </Stack>
              <Stack direction="row">
                <Box component="span" sx={{ color: 'text.secondary', width: 240, flexShrink: 0 }}>
                  Recipient wallet address:
                </Box>
                {recipientWallet}
              </Stack>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', my: 4 }} />
            <FormProvider methods={methods1} onSubmit={onSubmit1}>
              <Stack
                direction="row"
                justifyContent="center"
                sx={{ alignItems: 'center' }}
                spacing={4}
              >
                <Stack sx={{ width: '50%' }}>
                  <RHFTextField
                    name="newCommissionAddress"
                    label="enter new commission wallet address"
                  />
                </Stack>

                <Stack alignItems="flex-end">
                  <LoadingButton
                    type="submit"
                    sx={{ height: '40px', margin: 'auto' }}
                    variant="contained"
                    loading={isSubmitting1}
                  >
                    Change commission wallet
                  </LoadingButton>
                </Stack>
              </Stack>
            </FormProvider>
            <FormProvider methods={methods2} onSubmit={onSubmit2}>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={4}
                sx={{ alignItems: 'center', mt: 4 }}
              >
                <Stack sx={{ width: '50%' }}>
                  <RHFTextField
                    name="newRecipientAddress"
                    label="enter new recipient wallet address"
                  />
                </Stack>

                <Stack alignItems="flex-end">
                  <LoadingButton
                    type="submit"
                    sx={{ height: '40px', margin: 'auto' }}
                    variant="contained"
                    loading={isSubmitting2}
                  >
                    Change recipient wallet
                  </LoadingButton>
                </Stack>
              </Stack>
            </FormProvider>

            <Divider sx={{ borderStyle: 'dashed', my: 4 }} />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
