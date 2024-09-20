'use client';

import { useCallback, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
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

export default function BuyticketView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { address, connected, wallet, signTransaction } = useWallet();

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

  const onSubmit = handleSubmit(async () => {
    const validAddress = await validateTronAdddress(values.reffererAddress);
    if (validAddress || values.reffererAddress === '') {
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
                let instance = await window.tronWeb.contract(USDT_ABI, usdtAddress);
                let res = await instance.allowance(address, contractAddress).call();

                if (res < ticketPrice) {
                  instance = await window.tronWeb.contract(USDT_ABI, usdtAddress);
                  res = await instance.approve(contractAddress, ticketPrice).send({
                    feeLimit: 100_000_000,
                    callValue: 0,
                    shouldPollResponse: true,
                  });
                  console.log('111111', res);
                }

                // if (res) {
                instance = await window.tronWeb.contract(MLM_ABI, contractAddress);

                const radd =
                  values.reffererAddress === ''
                    ? '0x0000000000000000000000000000000000000000'
                    : values.reffererAddress;

                res = await instance.buyTicket(radd).send({
                  feeLimit: 100_000_000,
                  callValue: 0,
                  shouldPollResponse: true,
                });

                if (res?.error) {
                  enqueueSnackbar('Error occured.', { variant: 'error' });
                } else {
                  enqueueSnackbar('Ticket buying is successful.');
                }

                console.log('2222222', res);
                // }
              }
            })
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Refferer address is not correct.', { variant: 'error' });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ marginBottom: '10px' }}>
          {' '}
          Buy Ticket{' '}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 6 }}>
              <Stack sx={{ alignItems: 'center' }}>
                <RHFTextField
                  name="reffererAddress"
                  label="enter referral or wallet address"
                  sx={{ width: 1 / 2 }}
                />
              </Stack>

              <Stack alignItems="flex-end" sx={{ mt: 3, alignItems: 'center' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Buy ticket
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
