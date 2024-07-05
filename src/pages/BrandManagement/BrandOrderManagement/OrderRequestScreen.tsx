import React, { useState } from 'react';
import { OrderInterface } from '../../../models/OrderModel';
import OrderRequestDetailsComponent from './OrderRequestDetailsComponent';
import Sidebar from '../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../GlobalComponent/NavBarComponent/NavbarComponent';


const exampleOrder: OrderInterface = {
  orderID: "12345678",
  parentOrderID: "87654321",
  designID: "98765432",
  design: {
    designID: "98765432",
    userID: "user123",
    expertTailoringName: "Expert Tailor",
    titleDesign: "Sample Design",
    publicStatus: true,
    createDate: "2024-07-04T08:00:00Z",
    lastModifiedDate: "2024-07-04T10:00:00Z",
    partOfDesigns: [
      {
        partOfDesignID: "part1",
        designID: "98765432",
        partOfDesignName: "Front Design",
        createDate: "2024-07-04T08:30:00Z",
        lastModifiedDate: "2024-07-04T08:45:00Z",
        imgUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1720108220/clothes/lrwqtnrzic5unbdrs38m.webp",
        successImageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1720108220/clothes/lrwqtnrzic5unbdrs38m.webp",
        itemMasks: [
          {
            itemMaskID: "mask1",
            itemMaskName: "Logo",
            typeOfItem: "Logo",
            positionX: 100,
            positionY: 50,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1718867961/system-item/zcrpva43edwpw49tfqxn.png",
            isSystemItem: true,
            zIndex: 1,
            printType: "Embroidery",
            rotate: 0,
            itemMaterial: {
              itemMaterialID: "mat1",
              materialID: "material1",
              createDate: "2024-07-04T09:00:00Z",
              lastModifiedDate: "2024-07-04T09:15:00Z",
            }
          },
          {
            itemMaskID: "mask2",
            itemMaskName: "Text",
            typeOfItem: "Text",
            positionX: 120,
            positionY: 70,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1718867957/system-item/wkzdknr45euq1kaddirt.png",
            isSystemItem: false,
            zIndex: 2,
            printType: "Digital Print",
            rotate: 0,
            itemMaterial: {
              itemMaterialID: "mat2",
              materialID: "material2",
              createDate: "2024-07-04T09:30:00Z",
              lastModifiedDate: "2024-07-04T09:45:00Z",
            }
          },
          {
            itemMaskID: "mask3",
            itemMaskName: "Patch",
            typeOfItem: "Patch",
            positionX: 80,
            positionY: 90,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1718867955/system-item/vbti4tliu6jwdcoxfuwi.png",
            isSystemItem: true,
            zIndex: 3,
            printType: "Screen Print",
            rotate: -15,
            itemMaterial: {
              itemMaterialID: "mat3",
              materialID: "material3",
              createDate: "2024-07-04T10:00:00Z",
              lastModifiedDate: "2024-07-04T10:15:00Z",
            }
          },
          // Add more item masks as needed
        ],
        materialID: "material1",
      },
      {
        partOfDesignID: "part2",
        designID: "98765432",
        partOfDesignName: "Back Design",
        createDate: "2024-07-04T09:00:00Z",
        lastModifiedDate: "2024-07-04T09:15:00Z",
        imgUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1720108220/clothes/lrwqtnrzic5unbdrs38m.webp",
        successImageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1720108220/clothes/lrwqtnrzic5unbdrs38m.webp",
        itemMasks: [
          {
            itemMaskID: "mask4",
            itemMaskName: "Pattern",
            typeOfItem: "Pattern",
            positionX: 80,
            positionY: 70,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/qij6j79rp1bysj9yr2w4.png",
            isSystemItem: false,
            zIndex: 1,
            printType: "Digital Print",
            rotate: 45,
            itemMaterial: {
              itemMaterialID: "mat4",
              materialID: "material4",
              createDate: "2024-07-04T09:30:00Z",
              lastModifiedDate: "2024-07-04T09:45:00Z",
            }
          },
          {
            itemMaskID: "mask5",
            itemMaskName: "Label",
            typeOfItem: "Label",
            positionX: 100,
            positionY: 60,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/ksq4ukq6y7rrqphhargb.png",
            isSystemItem: true,
            zIndex: 2,
            printType: "Screen Print",
            rotate: 0,
            itemMaterial: {
              itemMaterialID: "mat5",
              materialID: "material5",
              createDate: "2024-07-04T10:00:00Z",
              lastModifiedDate: "2024-07-04T10:15:00Z",
            }
          },
          {
            itemMaskID: "mask6",
            itemMaskName: "Emblem",
            typeOfItem: "Emblem",
            positionX: 120,
            positionY: 80,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1718867954/system-item/jy00g3tl0uufr3id9xdr.png",
            isSystemItem: true,
            zIndex: 3,
            printType: "Embroidery",
            rotate: -30,
            itemMaterial: {
              itemMaterialID: "mat6",
              materialID: "material6",
              createDate: "2024-07-04T10:30:00Z",
              lastModifiedDate: "2024-07-04T10:45:00Z",
            }
          },
          // Add more item masks as needed
        ],
        materialID: "material2",
      },
      {
        partOfDesignID: "part3",
        designID: "98765432",
        partOfDesignName: "Sleeve Design",
        createDate: "2024-07-04T09:30:00Z",
        lastModifiedDate: "2024-07-04T09:45:00Z",
        imgUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1720108220/clothes/lrwqtnrzic5unbdrs38m.webp",
        successImageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1720108220/clothes/lrwqtnrzic5unbdrs38m.webp",
        itemMasks: [
          {
            itemMaskID: "mask7",
            itemMaskName: "Badge",
            typeOfItem: "Badge",
            positionX: 110,
            positionY: 65,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1717427240/system-item/m3db5g1dfvpdkuexjirs.avif",
            isSystemItem: false,
            zIndex: 1,
            printType: "Digital Print",
            rotate: 10,
            itemMaterial: {
              itemMaterialID: "mat7",
              materialID: "material7",
              createDate: "2024-07-04T10:00:00Z",
              lastModifiedDate: "2024-07-04T10:15:00Z",
            }
          },
          {
            itemMaskID: "mask8",
            itemMaskName: "Pattern",
            typeOfItem: "Pattern",
            positionX: 95,
            positionY: 75,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/hqojko4jozfrdcarsgd8.png",
            isSystemItem: true,
            zIndex: 2,
            printType: "Screen Print",
            rotate: 0,
            itemMaterial: {
              itemMaterialID: "mat8",
              materialID: "material8",
              createDate: "2024-07-04T10:30:00Z",
              lastModifiedDate: "2024-07-04T10:45:00Z",
            }
          },
          {
            itemMaskID: "mask9",
            itemMaskName: "Label",
            typeOfItem: "Label",
            positionX: 85,
            positionY: 70,
            imageUrl: "https://res.cloudinary.com/dby2saqmn/image/upload/v1717427241/system-item/reqfjzswqaeayc3k1pj5.jpg",
            isSystemItem: false,
            zIndex: 3,
            printType: "Embroidery",
            rotate: -15,
            itemMaterial: {
              itemMaterialID: "mat9",
              materialID: "material9",
              createDate: "2024-07-04T11:00:00Z",
              lastModifiedDate: "2024-07-04T11:15:00Z",
            }
          },
          // Add more item masks as needed
        ],
        materialID: "material3",
      },
      // Add more parts of design as needed
    ],
    typeOfDesign: "Custom",
    imgUrl: "data:image/jpeg;base64,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",
    color: "#ffffff",
  },
  brandID: "brand123",
  quantity: 10,
  discountID: "discount123",
  orderStatus: "Pending",
  orderType: "Custom Order",
  address: "123 Sample St",
  district: "Sample District",
  province: "Sample Province",
  ward: "Sample Ward",
  phone: 1234567890,
  buyerName: "John Doe",
  totalPrice: 1500.50,
  employeeID: "employee123",
  expectedStartDate: "2024-07-05T08:00:00Z",
  expectedProductCompletionDate: "2024-07-10T08:00:00Z",
  estimatedDeliveryDate: "2024-07-15T08:00:00Z",
  productionStartDate: "2024-07-06T08:00:00Z",
  productCompletionDate: "2024-07-11T08:00:00Z",
  createDate: "2024-07-03T08:00:00Z",
  lastModifiedDate: "2024-07-04T11:00:00Z",
};

const OrderRequestScreen: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('manage_order_request');
  const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
  const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = (menu: any) => {
    setActiveMenu(menu);
  };

  const togglePopper = (key: any) => {
    setPopperOpen((prev) => ({
      notification: key === 'notification' ? !prev.notification : false,
      user: key === 'user' ? !prev.user : false,
    }));
  };

  return (
    <div>

      <div className="flex">
        <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
        <div className="flex flex-col w-full">
          <Navbar toggleMenu={toggleMenu} menu="Mangage Brand Order" popperOpen={popperOpen} togglePopper={togglePopper} />
          <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
            <OrderRequestDetailsComponent order={exampleOrder} />
          </main>
        </div>
      </div>


    </div>
  );
};

export default OrderRequestScreen;
