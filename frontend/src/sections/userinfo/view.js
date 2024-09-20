'use client';

import { useState, useEffect, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { contractAddress, usdtAddress, ticketPrice, API_URL } from '../../utils/constant';
import { validateTronAdddress } from '../../utils/utils';
import MLM_ABI from '../../utils/abi/mlm.json';
import USDT_ABI from '../../utils/abi/usdt.json';
// ----------------------------------------------------------------------

export default function UserInfoView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { address, connected, wallet, signTransaction } = useWallet();
  const [availAmount, setAvailAmount] = useState(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [refererAddress, setRefererAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [referralsCount, setReferralsCount] = useState(0);
  const [withdrawnReward, setWithdrawnReward] = useState(0);

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      userAddress: '',
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
    try {
      if (address && values.userAddress) {
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
              let res;
              const user = await instance.getUser(values.userAddress).call();
              console.log('5555', user, values.userAddress);
              const owner = await instance.owner().call();
              setBalance(user.referralCommission);
              setRefererAddress(window.tronWeb.address.fromHex(user.referrer));
              setReferralsCount(user.referralsCount.reduce((a, b) => Number(a) + Number(b), 0));
              setWithdrawnReward(user.withdrawnReward);
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error occured.', { variant: 'error' });
    }

    // await new Promise((resolve) => setTimeout(resolve, 500));
    // reset();
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ marginBottom: '10px' }}>
          {' '}
          User Info{' '}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 6 }}>
              <Stack sx={{ alignItems: 'center' }}>
                <RHFTextField name="userAddress" label="User Address" sx={{ width: 1 / 2 }} />
                <Stack direction="column" sx={{ marginTop: '20px' }}>
                  <Stack direction="row" spacing={2}>
                    <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                      Referrer:
                    </Box>
                    {refererAddress}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                      Referral Commission:
                    </Box>
                    {balance / 1000000} USDT
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                      Withdrawn Reward:
                    </Box>
                    {withdrawnReward / 1000000} USDT
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                      Referrals Count:
                    </Box>
                    {referralsCount}
                  </Stack>
                </Stack>
              </Stack>

              <Stack alignItems="flex-end" sx={{ mt: 3, alignItems: 'center' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Get Info
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
