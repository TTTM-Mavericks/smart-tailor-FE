import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { grayColor, grayColor1, greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../root/ColorSystem'
import styles from './Header.module.scss';
import { systemLogo } from '../../assets';
import { useTranslation } from 'react-i18next';
import {
  Link,
  MenuItem,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  Tooltip,
  Badge,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { Logout, NotificationAdd, Notifications } from '@mui/icons-material';
import HeaderLanguageSetting from '../LanguageSetting/LanguageSettingComponent';
import { UserInterface } from '../../models/UserModel';
import Cookies from 'js-cookie';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../api/ApiConfig';
import { ToastContainer, toast } from 'react-toastify';
import { NotificationInterface } from '../../models/NotificationModel';
import { IoMdNotifications } from "react-icons/io";
import { generateNotificationMessage } from '../../utils/ElementUtils';
import { __getToken, __getUserLogined } from '../../App';



function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export interface NotificationRealtimeInterface {
  sender: string;
  recipient: string;
  message: string;
  type: string;
}

export default function HeaderComponent() {
  const [open, setOpen] = useState<boolean>(false)

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userLogined, setUserLogined] = useState<UserInterface>();
  const [notificationList, setNotificationList] = useState<NotificationInterface[]>([]);
  const [notiNumber, setNotiNumber] = useState<number>(0);
  const [messages, setMessages] = useState<NotificationInterface[]>([]);
  const [websocketUrl, setWebsocketUrl] = useState<string>();

  const navigation = {
    categories: [

      {
        id: 'product',
        name: 'Products',
        href: '/product',
        number: '000130',
        type: 'page'
      },
      {
        id: 'design',
        name: 'Design',
        href: `${__getUserLogined()?.userID ? '/design_create' : '/auth/signin'}`,
        number: '000132',
        type: 'page'
      },
      {
        id: 'about',
        name: 'About us',
        number: '000133',
        href: '/about',
        type: 'page'
      },
      {
        id: 'report',
        name: 'Report',
        href: '/report',
        number: '000134',
        type: 'page'
      },
    ],
    categories_2: [
      {
        id: 'products',
        name: 'Products',
        type: 'menu',
        number: '000130',
        featured: [
          {
            name: 'New Arrivals',
            href: '/product',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
            imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
          },
          {
            name: 'Basic Tees',
            href: '/product',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
            imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
          },
        ],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Tops', href: '#' },
              { name: 'Dresses', href: '#' },
              { name: 'Pants', href: '#' },
              { name: 'Denim', href: '#' },
              { name: 'Sweaters', href: '#' },
              { name: 'T-Shirts', href: '#' },
              { name: 'Jackets', href: '#' },
              { name: 'Activewear', href: '#' },
              { name: 'Browse All', href: '#' },
            ],
          },
          {
            id: 'accessories',
            name: 'Accessories',
            items: [
              { name: 'Watches', href: '#' },
              { name: 'Wallets', href: '#' },
              { name: 'Bags', href: '#' },
              { name: 'Sunglasses', href: '#' },
              { name: 'Hats', href: '#' },
              { name: 'Belts', href: '#' },
            ],
          },
          {
            id: 'brands',
            name: 'Brands',
            items: [
              { name: 'Full Nelson', href: '#' },
              { name: 'My Way', href: '#' },
              { name: 'Re-Arranged', href: '#' },
              { name: 'Counterfeit', href: '#' },
              { name: 'Significant Other', href: '#' },
            ],
          },
        ],
      },
      {
        id: 'sewingcompany',
        name: 'Sewing company',
        type: 'menu',
        number: '000131',
        featured: [
          {
            name: 'New Arrivals',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
            imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
          },
          {
            name: 'Artwork Tees',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
            imageAlt:
              'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
          },
        ],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Tops', href: '#' },
              { name: 'Pants', href: '#' },
              { name: 'Sweaters', href: '#' },
              { name: 'T-Shirts', href: '#' },
              { name: 'Jackets', href: '#' },
              { name: 'Activewear', href: '#' },
              { name: 'Browse All', href: '#' },
            ],
          },
          {
            id: 'accessories',
            name: 'Accessories',
            items: [
              { name: 'Watches', href: '#' },
              { name: 'Wallets', href: '#' },
              { name: 'Bags', href: '#' },
              { name: 'Sunglasses', href: '#' },
              { name: 'Hats', href: '#' },
              { name: 'Belts', href: '#' },
            ],
          },
          {
            id: 'brands',
            name: 'Brands',
            items: [
              { name: 'Re-Arranged', href: '#' },
              { name: 'Counterfeit', href: '#' },
              { name: 'Full Nelson', href: '#' },
              { name: 'My Way', href: '#' },
            ],
          },
        ],
      },
    ]
  }

  // const userStorage: any = Cookies.get('userAuth');
  // if (userStorage) return;
  // const userParse: UserInterface = JSON.parse(userStorage);
  // const websocketUrl = `ws://localhost:6969/websocket?userid=${userParse.userID}`;

  // 1. First useEffect to fetch notifications and set notiNumber
  useEffect(() => {
    const user = __getUserLogined();
    console.log('user: ', user);
    if (!user) return;
    const fetchNotifications = async () => {
      console.log('ahsd jkashd jash dashdaskjdh jashd kj');
      try {
        const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.notification + functionEndpoints.notification.getNotiByUserId}/${__getUserLogined().userID}`, null, __getToken());
        if (response.status === 200) {
          const sortedData = response.data.sort((a: NotificationInterface, b: NotificationInterface) => {
            return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
          });
          setNotificationList(sortedData);
          console.log(response.data);
          const filterStatusNoti = response.data.filter((noti: NotificationInterface) => noti.status === false);
          setNotiNumber(filterStatusNoti.length);
        } else {
          toast.error(`${response.message}`, { autoClose: 4000 });
        }
      } catch (error) {
        toast.error(`${error}`, { autoClose: 4000 });
        console.log('error: ', error);
      }
    };

    fetchNotifications();
  }, []);

  // 2. Second useEffect to handle WebSocket connection after notiNumber is set
  useEffect(() => {
    if (!websocketUrl) return;
    const originalTitle = document.title;
    const websocket = new WebSocket(websocketUrl);

    websocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocket.onmessage = (event) => {
      console.log('Message received:', event.data);
      const data: NotificationInterface = JSON.parse(event.data);
      console.log(data);
      setMessages(prevMessages => [...prevMessages, data]);
      setNotiNumber(prevNotiNumber => prevNotiNumber + 1); // Ensure state is updated correctly
      document.title = `New message | ${originalTitle}`;
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, [websocketUrl]);


  useEffect(() => {
    console.log('header: ', userLogined);
    const checkLoginStatus = () => {
      const userSession = Cookies.get('userAuth');
      if (userSession) {
        const userParse: UserInterface = JSON.parse(userSession);
        setWebsocketUrl(`ws://localhost:6969/websocket?userid=${userParse.userID}`);

        setUserLogined(userParse)
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);

  const isOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenNotiMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleCloseNotiMenu = () => {
    setAnchorEl1(null);
  };

  // Logout 
  const __handleLogout = async () => {
    try {
      const authToken = Cookies.get('token');
      const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signout}`, authToken);
      if (response.status === 200) {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        Cookies.remove('userAuth');

        window.location.href = '/auth/signin'

      } else {
        toast.error(`${response.message}`, { autoClose: 4000 });
      }
      console.log(response);

    } catch (error: any) {
      console.error('Error posting data:', error);
      toast.error(`${error}`, { autoClose: 4000 });
      // Toast.show({
      //   type: 'error',
      //   text1: JSON.stringify(error.message),
      //   position: 'top'
      // });
    }
  }

  // Get language in local storage
  const selectedLanguage = localStorage.getItem('language');
  const codeLanguage = selectedLanguage?.toUpperCase();

  // Using i18n
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (selectedLanguage !== null) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);


  const [proposalOpen, setProposalOpen] = useState<boolean>(false);

  const toggleProposal = () => {
    setProposalOpen(!proposalOpen);
  };

  const truncateMessage = (message: string, maxLength: number = 30): string => {
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  };


  interface NotificationMenuProps {
    anchorEl: HTMLElement | null;
    handleClose: () => void;
    notiNumber: number;
    messages: NotificationInterface[];
    notificationList: NotificationInterface[];
  }

  const NotificationMenu: React.FC<NotificationMenuProps> = ({
    anchorEl,
    handleClose,
    notiNumber,
    messages,
    notificationList,
  }) => {
    const __handleMaskNotiRead = async (noti: NotificationInterface) => {

      try {
        const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.notification + functionEndpoints.notification.updateReadStatus}/${noti.notificationID}`);
        if (response.status === 200) {
          if (noti.type === 'ORDER') {
            window.open(`/order_detail/${noti.targetID}`, '_blank');
          }
          if (noti.type === 'PAYMENT') {
            window.open(`/order_history`, '_blank');
          }
          if (noti.type === 'REFUND') {
            window.open(`/refund_history`, '_blank');
          }
          if (noti.type === 'REPORT') {
            window.open(`/report_history`, '_blank');
          }
          console.log(response.data);

          window.location.reload();
        }
        else {
          toast.error(`${response.message}`, { autoClose: 4000 });
          return;
        }
      } catch (error) {
        toast.error(`${error}`, { autoClose: 4000 });
        console.log('error: ', error);

      }
    }
    return (
      <div className={`${styles.notiMenu_content}`}>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '300px',
              maxHeight: '50vh',
              overflowY: 'auto',
              padding: '2px',
              scrollbarWidth: 'none', /* For Firefox */
              '-ms-overflow-style': 'none', /* For Internet Explorer and Edge */
            },
          }}

        >
          <div className={`${styles.notiMenu_content} relative`}>
            <p style={{ position: 'absolute', top: 0, right: 10 }}>
              <a href='/notification' style={{ color: secondaryColor, fontSize: 11, textDecorationLine: 'underline' }}>View full</a>
            </p>
            {messages.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm pl-4">New notifications</span>
                <div className="space-y-4 p-4">
                  {messages.map((notification, index) => (
                    <Card
                      key={index}
                      className="shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl"
                      onClick={() => __handleMaskNotiRead(notification)}

                    >
                      <CardContent>
                        <div style={{fontSize: 12}}  className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-indigo-700 text-sm">
                            {notification.type || 'SYSTEM'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {truncateMessage(generateNotificationMessage(notification))}
                        </p>
                        <p style={{fontSize: 12}}  className="text-gray-700 mb-4 text-sm">
                          ID: {notification.targetID}
                        </p>
                        <p style={{fontSize: 11}} className="text-gray-500">
                          Create at: {notification.createDate}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2">
              <span className="text-gray-500 text-sm pl-4">Old notifications ({notificationList.length})</span>
              <div className="space-y-4 p-4">
                {notificationList.map((notification) => (
                  <Card
                    key={notification.notificationID}
                    className="shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl"
                    style={{ backgroundColor: !notification.status ? '#FAFAFA' : whiteColor }}
                    onClick={() => __handleMaskNotiRead(notification)}

                  >
                    <CardContent >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-indigo-700 text-sm" style={{ fontSize: 12 }}>
                          {notification.type || 'SYSTEM'}
                        </span>
                        <span className="font-semibold text-indigo-700 text-sm" style={{ fontSize: 10, color: notification.status ? greenColor : primaryColor }}>
                          {notification.status ? 'Read' : 'Not read'}
                        </span>
                      </div>
                      <Typography variant="body2" className="text-gray-700 mb-4" style={{ fontSize: 12 }}>
                        {truncateMessage(generateNotificationMessage(notification))}
                      </Typography>
                      <p style={{fontSize: 12}}  className="text-gray-700 mb-4 text-sm">
                          ID: {notification.targetID}
                        </p>
                        <p style={{fontSize: 11}} className="text-gray-500">
                          Create at: {notification.createDate}
                        </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Menu >
      </div >
    );
  };


  return (
    <div className={`${styles.header__container} bg-white`}>
      <ToastContainer></ToastContainer>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                              'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium'
                            )
                          }
                        // href={category.href}
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>

                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel key={category.name} className="space-y-10 px-4 pb-8 pt-10">
                        <div className="grid grid-cols-2 gap-x-4">

                          {category?.featured?.map((item: any) => (
                            <div key={item.name} className="group relative text-sm">
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                              </div>
                              <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {category?.sections?.map((section: any) => (
                          <div key={section.name}>
                            <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item: any) => (
                                <li key={item.name} className="flow-root">
                                  <a href={item.href} className="-m-2 block p-2 text-gray-500">
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                {/* <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div> */}

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <a href="/auth/sigin" className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </a>
                  </div>
                  <div className="flow-root">
                    <a href="/auth/signup" className="-m-2 block p-2 font-medium text-gray-900">
                      Sign up
                    </a>
                  </div>
                </div>

                {/* <div className="border-t border-gray-200 px-4 py-6">
                  <a href="#" className="-m-2 flex items-center p-2">
                    <img
                      src={systemLogo}
                      alt=""
                      className={`${styles.logo}`}
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop */}
      <header className="relative bg-white">
        <p
          className="flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8"
          style={{ backgroundColor: primaryColor }}
        >
          {t(codeLanguage + '000128')}
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden focus:outline-none"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <img className={`${styles.logo}`} src={systemLogo} alt="" />
                </a>
              </div>



              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <a
                              href={category.href}
                              onClick={toggleProposal}
                              className={classNames(
                                open ? 'text-indigo-600 border-red-500' : 'border-transparent text-gray-700 hover:text-gray-800',
                                'relative z-10 -mb-px flex items-center pt-px text-sm font-medium transition-colors duration-200 ease-out focus:outline-none focus:border-red-500'
                              )}
                            >
                              {t(codeLanguage + `${category.number}`)}
                            </a>
                          </div>


                        </>
                      )}
                    </Popover>
                  ))}
                </div>
              </Popover.Group>

              {isLoggedIn ? (
                <div className="ml-auto flex items-center">
                  {/* Search */}
                  <div className="flex lg:ml-6">
                    <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </a>
                  </div>

                  {/* Noti */}
                  <div className="mr-2 flow-root lg:ml-6">
                    <a onClick={handleClickOpenNotiMenu} className="group -m-2 flex items-center p-2 cursor-pointer">
                      <Badge badgeContent={notiNumber} color={'primary'}
                        sx={{
                          '& .MuiBadge-dot': {
                            backgroundColor: notiNumber > 0 ? 'red' : 'gray',
                          },
                        }}>
                        <IoMdNotifications color={notiNumber > 0 ? primaryColor : 'gray'} size={25} />
                      </Badge>
                    </a>
                    <NotificationMenu
                      anchorEl={anchorEl1}
                      handleClose={handleCloseNotiMenu}
                      notiNumber={notiNumber}
                      messages={messages}
                      notificationList={notificationList}
                    />
                  </div>

                  {/* Notification Menu */}




                  {/* EN VI */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <HeaderLanguageSetting />
                  </div>

                  {/* Profile */}
                  <React.Fragment>
                    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                      <Tooltip title={t(codeLanguage + '000044')}>
                        <IconButton
                          onClick={handleClick}
                          size="small"
                          sx={{ ml: 2 }}
                          aria-controls={isOpen ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={isOpen ? 'true' : undefined}
                        >
                          <Avatar src={userLogined?.imageUrl} sx={{ width: 32, height: 32 }}>M</Avatar>
                        </IconButton>
                      </Tooltip>
                    </div>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={isOpen}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem>
                        <a href={"/auth/profilesetting"} style={{ display: "flex", textDecoration: "none" }}>
                          <Avatar src={userLogined?.imageUrl} /> <p style={{ color: "black", marginTop: "4px" }}>{t(codeLanguage + '000045')}</p>
                        </a>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={__handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        {t(codeLanguage + '000047')}
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                </div>
              ) : (
                <div className="ml-auto flex items-center">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <a href="/auth/signin" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      {t(codeLanguage + '000002')}
                    </a>
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    <a href="/auth/signup" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      {t(codeLanguage + '000003')}
                    </a>
                  </div>

                  {/* Search */}
                  <div className="flex lg:ml-6">
                    <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </a>
                  </div>

                  {/* Cart */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <a href="#" className="group -m-2 flex items-center p-2">
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>

                  {/* EN VI */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <HeaderLanguageSetting />
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

    </div >
  )
}

