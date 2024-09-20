'use client';

import { useState, useEffect, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Icon } from '@iconify/react';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';

import { usdtAddress, API_URL, contractAddress } from '../../../utils/constant';
import MLM_ABI from '../../../utils/abi/mlm.json';
import USDT_ABI from '../../../utils/abi/usdt.json';
// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'followers',
  //   label: 'Followers',
  //   icon: <Iconify icon="solar:heart-bold" width={24} />,
  // },
  // {
  //   value: 'friends',
  //   label: 'Friends',
  //   icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  // },
  // {
  //   value: 'gallery',
  //   label: 'Gallery',
  //   icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useMockedUser();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  const { address, connected, wallet, signTransaction } = useWallet();
  const [tronBalance, setTronBalance] = useState('');
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [referralCommission, setReferralCommission] = useState(0);
  const [refererAddress, setRefererAddress] = useState('');
  const [referralsCount, setReferralsCount] = useState(0);
  const [withdrawnReward, setWithdrawnReward] = useState(0);
  const [user1, setUser1] = useState({});

  useEffect(() => {
    (async () => {
      if (address) {
        setTronBalance(await window.tronWeb.trx.getBalance(address));
        const usdt = await window.tronWeb.trx.getContract(usdtAddress);
        let instance = await window.tronWeb.contract(USDT_ABI, usdtAddress);
        setUsdtBalance(await instance.balanceOf(address).call());

        instance = await window.tronWeb.contract(MLM_ABI, contractAddress);
        const user2 = await instance.getUser(address).call();
        setReferralCommission(user2.referralCommission);
        setRefererAddress(window.tronWeb.address.fromHex(user2.referrer));
        setReferralsCount(user2.referralsCount.reduce((a, b) => Number(a) + Number(b), 0));
        setWithdrawnReward(user2.withdrawnReward);

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

  const copyToClipboard = () => {
    const textArea = document.createElement('textarea');

    // Set the value of the temporary textarea with the text you want to copy
    textArea.value = address;

    // Add the textarea node to the DOM
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the textarea node from the DOM
    document.body.removeChild(textArea);
    // notifyCopied();
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}
      <Typography variant="h4" sx={{ marginBottom: '10px' }}>
        {' '}
        My Profile{' '}
      </Typography>
      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={_userAbout.role}
          name={registered ? user1?.username : ''}
          email={address || ''}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && (
        <ProfileHome
          info={_userAbout}
          posts={_userFeeds}
          tronBalance={tronBalance}
          usdtBalance={usdtBalance}
          referralsCount={referralsCount}
          referralCommission={referralCommission}
          withdrawnReward={withdrawnReward}
        />
      )}

      {currentTab === 'followers' && <ProfileFollowers followers={_userFollowers} />}

      {currentTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />}
    </Container>
  );
}
