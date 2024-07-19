import React, { useEffect, useState } from 'react';
import { OrderInterface, OrderRequestDetailInterface } from '../../../models/OrderModel';
import OrderRequestDetailsComponent from './OrderRequestDetailsComponent';
import Sidebar from '../GlobalComponent/SideBarComponent/SideBarComponent';
import Navbar from '../GlobalComponent/NavBarComponent/NavbarComponent';
import { useNavigate, useParams } from 'react-router-dom';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { DesignDetailInterface, DesignInterface } from '../../../models/DesignModel';
import { ToastContainer } from 'react-toastify';


interface OrderDetailInterface {
  design: DesignInterface,
  order: OrderInterface,
  designDetail: DesignDetailInterface[]
}
const OrderRequestScreen: React.FC = () => {

  // TODO MUTIL LANGUAGE

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('manage_material');
  const [showScrollButton, setShowScrollButton] = React.useState<boolean>(false);
  const [popperOpen, setPopperOpen] = useState<Record<string, boolean>>({});
  const [orderDetail, setOrderDetail] = useState<OrderDetailInterface>();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    __handleGetOrderDetail();
  }, [])

  // ---------------FunctionHandler---------------//

  //+++++ API +++++//
  /**
   * Handle get order detail data
   */
  const __handleGetOrderDetail = async () => {
    try {
      const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getAllInforOrderDetail}/${id}`);
      if (response.status === 200) {
        console.log('detail order: ', response.data);
        if (response.data === null) {
          navigate('/pickedOrder')
        } else
          if (response.data.design === null) {
            navigate('/pickedOrder')
          } else
            if (response.data.designDetail.length === 0) {
              navigate('/pickedOrder')
            }
            else {
              setOrderDetail(response.data);
            }
      }
      else {
        console.log('detail order: ', response.message);
        // navigate('/error404');
      }
    } catch (error) {
      console.log('error: ', error);
      // navigate('/error404');
    }
  }

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
      <ToastContainer></ToastContainer>
      <div className="flex">
        <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
        <div className="flex flex-col w-full">
          <Navbar toggleMenu={toggleMenu} menu="Mangage Brand Price" popperOpen={popperOpen} togglePopper={togglePopper} />
          <main className="p-6 flex-grow ml-0 xl:ml-[20%]">
            {orderDetail && (
              <OrderRequestDetailsComponent order={orderDetail.order} design={orderDetail.design} designDetail={orderDetail.designDetail} />
            )}
          </main>
        </div>
      </div>


    </div>
  );
};

export default OrderRequestScreen;
