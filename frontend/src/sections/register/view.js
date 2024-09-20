'use client';

import { useCallback, useMemo } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import Iconify from 'src/components/iconify';
// components
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { contractAddress, usdtAddress, ticketPrice, API_URL } from '../../utils/constant';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { address, connected, wallet, signTransaction } = useWallet();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      email: '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async () => {
    try {
      if (address === '' || !address) {
        enqueueSnackbar('Tron wallet connection error.', { variant: 'error' });
        return;
      }

      const data1 = {
        username: values.name,
        email: values.email,
        walletAddress: address,
      };

      await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data1),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.type === 'failed') {
            enqueueSnackbar(data.message, { variant: 'error' });
            // return;
          } else {
            enqueueSnackbar(data.message);
          }
        })
        .catch((error) => console.error(error));

      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ marginBottom: '10px' }}>
          {' '}
          Register{' '}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 6 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Nick Name" />
                <RHFTextField name="email" label="Email Address" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Register
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
