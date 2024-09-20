'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Icon } from '@iconify/react';
import Link from '@mui/material/Link';
// components
import { useSettingsContext } from 'src/components/settings';
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { UserProfileView } from 'src/sections/user/view';
import { SeoIllustration } from 'src/assets/illustrations';
import Markdown from 'src/components/markdown';
import { usdtAddress, API_URL, contractAddress } from '../../utils/constant';
import AppWelcome from './app-welcome';
import AppFeatured from './app-featured';
// ----------------------------------------------------------------------

export default function HomeView() {
  const settings = useSettingsContext();

  const carouselsData = [...Array(3)].map((_, index) => ({
    id: index,
    title: '',
    coverUrl: `/assets/images/mlm${index + 1}.jpg`,
    description: '',
  }));

  const { address, connected, wallet, signTransaction } = useWallet();
  const [registered, setRegistered] = useState(false);
  const [user1, setUser1] = useState({});

  const VIDEOS = {
    deer: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-fast.mp4',
    snail: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-slow.mp4',
    cat: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-cute.mp4',
    spider: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-eek.mp4',
  };

  const _socials = [
    {
      value: 'facebook',
      name: 'FaceBook',
      icon: 'eva:facebook-fill',
      color: '#1877F2',
      path: 'https://www.facebook.com/caitlyn.kerluke',
    },
    {
      value: 'instagram',
      name: 'Instagram',
      icon: 'ant-design:instagram-filled',
      color: '#E02D69',
      path: 'https://www.instagram.com/caitlyn.kerluke',
    },
    {
      value: 'linkedin',
      name: 'Linkedin',
      icon: 'eva:linkedin-fill',
      color: '#007EBB',
      path: 'https://www.linkedin.com/caitlyn.kerluke',
    },
    {
      value: 'twitter',
      name: 'Twitter',
      icon: 'eva:twitter-fill',
      color: '#00AAEC',
      path: 'https://www.twitter.com/caitlyn.kerluke',
    },
  ];

  const CONTENT = `
<h6>Welcome to Solarcrypt!</h6>
<br/>

<p>At Solarcrypt, we're on a mission to revolutionize the world of multi-level marketing (MLM) through cutting-edge blockchain technology. Our journey began with a simple yet powerful idea: to empower individuals, from all walks of life, to achieve financial freedom and success in a transparent, decentralized, and secure manner.</p>

<br/>
<br/>

<h6>Our Vision</h6>
<br/>
<p>Our vision is to create a global MLM community where trust, fairness, and innovation reign supreme. We believe in a future where network marketing is driven by integrity and equality, ensuring that everyone can benefit from the MLM model without fear of fraud or deception. By harnessing the power of blockchain technology, we're transforming MLM into a more accountable and inclusive ecosystem.</p>

<br/>
<br/>

<h6>Why Blockchain?</h6>
<br/>
<p>Blockchain technology is at the heart of our platform. It offers unmatched security, transparency, and decentralization. With blockchain, every transaction is recorded on an immutable ledger, ensuring that your business operations are secure and tamper-proof. Our smart contracts automate processes, making payouts and rewards quick, accurate, and efficient. Say goodbye to the hassles of traditional MLM operations, and embrace a blockchain-powered future.</p>
<br/>
<br/>

<h6>Our Commitment</h6>
<br/>
<p>We are committed to providing you with an MLM platform that's easy to use and offers real opportunities for financial growth. We prioritize your success and well-being. Our dedicated team is always ready to assist you, whether you're a newcomer to MLM or a seasoned network marketer. We offer training, support, and resources to help you thrive in this dynamic industry.</p>
<br/>
<br/>

<h6>Join Us</h6>
<br/>
<p>We invite you to be a part of our MLM blockchain community. Together, we can rewrite the narrative of multi-level marketing, making it a force for good in people's lives. Join us in this journey towards financial empowerment, transparency, and a brighter future.</p>
<br/>
<br/>

`;

  useEffect(() => {
    (async () => {
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
          .then((data) => {
            console.log(data);
            if (data.type === 'failed') {
              // toast(data.message);
              // return;
              setRegistered(false);
              setUser1({});
            } else {
              // toast(data.message);
              setRegistered(true);
              setUser1(data.user);
            }
          })
          .catch((error) => console.error(error));

        // console.log("000000", usdt, USDT_ABI, res, res.toString())
      }
    })();
  }, [address]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ marginBottom: '10px' }}>
        {' '}
        Home{' '}
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${registered ? user1?.username : ''}`}
            description="We're excited to introduce you to an incredible opportunity that can help you take control of your financial future. Join our MLM referral program today and start on your path to financial success."
            img={<SeoIllustration />}
            action={
              <Link href="/dashboard/buyticket">
                <Button variant="contained" color="primary">
                  Go Now
                </Button>
              </Link>
            }
          />
        </Grid>
        <Grid xs={12} md={4}>
          <AppFeatured list={carouselsData} />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title="Social" />

            <Stack spacing={2} sx={{ p: 3 }}>
              {_socials.map((link) => (
                <Stack
                  key={link.name}
                  spacing={2}
                  direction="row"
                  sx={{ wordBreak: 'break-all', typography: 'body2' }}
                >
                  <Iconify
                    icon={link.icon}
                    width={24}
                    sx={{
                      flexShrink: 0,
                      color: link.color,
                    }}
                  />
                  <Link color="inherit">
                    {link.value === 'facebook' && 'https://www.facebook.com/caitlyn.kerluke'}
                    {link.value === 'instagram' && 'https://www.instagram.com/caitlyn.kerluke'}
                    {link.value === 'linkedin' && 'https://www.linkedin.com/in/caitlyn.kerluk'}
                    {link.value === 'twitter' && 'https://www.twitter.com/caitlyn.kerluke'}
                  </Link>
                </Stack>
              ))}
            </Stack>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardHeader title="Leran more" />

            <Stack spacing={2} sx={{ p: 3 }}>
              <Stack direction="row" spacing={2}>
                {/* eslint-disable */}
                <video
                  controls
                  autoPlay
                  src={VIDEOS.deer}
                  style={{ width: '-webkit-fill-available' }}
                />
                {/* eslint-enable */}
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Stack component={Card} spacing={3} sx={{ p: 3 }}>
            <Typography variant="h4">About Us</Typography>

            <Markdown children={CONTENT} />
          </Stack>
        </Grid>
      </Grid>
      {/* <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
      </Box> */}
      {/* <Card>
        <CardHeader title="Carousel Animation" />
        <CardContent>
          <CarouselAnimation data={carouselsData} />
        </CardContent>
      </Card> */}
    </Container>
  );
}
