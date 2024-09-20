'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';

import { UserProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function ProfileView() {
  const settings = useSettingsContext();

  const carouselsData = [...Array(3)].map((_, index) => ({
    id: index,
    title: '',
    coverUrl: `/assets/images/mlm${index + 1}.jpg`,
    description: '',
  }));

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* <Typography variant="h4" sx={{ marginBottom: '10px' }}>
        {' '}
        Profile{' '}
      </Typography> */}
      <UserProfileView />
      {/* <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      /> */}
      {/* <Card>
        <CardHeader title="Carousel Animation" />
        <CardContent>
          <CarouselAnimation data={carouselsData} />
        </CardContent>
      </Card> */}
    </Container>
  );
}
