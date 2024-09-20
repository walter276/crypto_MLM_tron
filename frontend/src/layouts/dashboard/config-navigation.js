import { useMemo, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { contractAddress, usdtAddress, ticketPrice, API_URL } from '../../utils/constant';
import MLM_ABI from '../../utils/abi/mlm.json';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const [isOwner, setIsOwner] = useState(false);
  const { address, connected, wallet, signTransaction } = useWallet();

  useEffect(() => {
    let unmounted = false;
    (async () => {
      if (address) {
        const instance = await window.tronWeb.contract(MLM_ABI, contractAddress);
        const user = await instance.getUser(address).call();
        const owner = await instance.owner().call();

        if (window.tronWeb.address.toHex(address) === owner && !unmounted) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [address]);

  const data = isOwner
    ? [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
          subheader: 'MLM system',
          items: [
            { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
            { title: 'My profile', path: paths.dashboard.profile, icon: ICONS.user },
            {
              title: 'Register',
              path: paths.dashboard.register,
              icon: <Icon icon="mdi:register-outline" width={24} height={24} />,
            },
            {
              title: 'Buy ticket',
              path: paths.dashboard.buyticket,
              icon: <Icon icon="icons8:buy" width={24} height={24} />,
            },
            {
              title: 'Withdraw',
              path: paths.dashboard.withdraw,
              icon: <Icon icon="uil:money-withdraw" width={24} height={24} />,
            },
            {
              title: 'User Info',
              path: paths.dashboard.userinfo,
              icon: <Icon icon="mingcute:user-info-line" width={24} height={24} />,
            },
            {
              title: 'Change Owner',
              path: paths.dashboard.changeowner,
              icon: <Icon icon="material-symbols:change-circle-outline" width={24} height={24} />,
            },
          ],
        },

        // MANAGEMENT
        // ----------------------------------------------------------------------
        // {
        //   subheader: 'management',
        //   items: [
        //     {
        //       title: 'user',
        //       path: paths.dashboard.group.root,
        //       icon: ICONS.user,
        //       children: [
        //         { title: 'four', path: paths.dashboard.group.root },
        //         { title: 'five', path: paths.dashboard.group.five },
        //         { title: 'six', path: paths.dashboard.group.six },
        //       ],
        //     },
        //   ],
        // },
      ]
    : [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
          subheader: 'MLM system',
          items: [
            { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
            { title: 'My profile', path: paths.dashboard.profile, icon: ICONS.user },
            {
              title: 'Register',
              path: paths.dashboard.register,
              icon: <Icon icon="mdi:register-outline" width={24} height={24} />,
            },
            {
              title: 'Buy ticket',
              path: paths.dashboard.buyticket,
              icon: <Icon icon="icons8:buy" width={24} height={24} />,
            },
            {
              title: 'Withdraw',
              path: paths.dashboard.withdraw,
              icon: <Icon icon="uil:money-withdraw" width={24} height={24} />,
            },
            {
              title: 'User Info',
              path: paths.dashboard.userinfo,
              icon: <Icon icon="mingcute:user-info-line" width={24} height={24} />,
            },
          ],
        },
      ];

  return data;
}
