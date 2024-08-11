import React, { useState, useRef } from 'react';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import { IconButton, Rating } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import ReviewProductComponent from '../ReviewProduct/ReviewProductScreen';
import { useParams } from 'react-router-dom';
import { ArrowUpward } from '@mui/icons-material';

const ProductDetailScreens = () => {

    // ---------------UseState Variable---------------//
    const [image, setImage] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const titleRef = useRef(null);
    const teamRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);


    // ---------------UseEffect---------------//

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // ---------------Usable Variable---------------//
    const maxQuantity = 16;
    const { id } = useParams();
    const isTitleVisible = useInView(titleRef, { once: true });
    const isTeamVisible = useInView(teamRef, { once: true });

    const imageUrls = [
        'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnv8xlobe9kdf4',
        'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnv8xlob5u2i19',
        'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnv8xlobcuzx6a',
        'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnv8xlobpi3x51',
    ];

    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param size 
     */
    const _handleSizeClick = (size: any) => {
        setSelectedSize(size);
    };

    /**
     * 
     * @param change 
     */
    const _handleQuantityChange = (change: any) => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + change;
            if (newQuantity < 1) return 1;
            if (newQuantity > maxQuantity) return maxQuantity;
            return newQuantity;
        });
    };

    /**
    * Scrolls the window to the top smoothly.
    */
    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div>
            <HeaderComponent />
            <div className="py-6" style={{ marginTop: "250px" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="flex flex-col md:flex-row -mx-4">

                        {/* Carousel */}
                        <div className="md:flex-1 px-4">
                            <motion.div
                                ref={teamRef}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isTeamVisible ? { opacity: 1, y: 0, transition: { duration: 1 } } : {}}
                            >
                                <div>
                                    <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4">
                                        <div className="h-64 md:h-60 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                                            <img src={imageUrls[image - 1]} alt={`Image ${image}`} />
                                        </div>
                                    </div>
                                    <div className="flex -mx-2 mb-4">
                                        {imageUrls.map((imageUrl, index) => (
                                            <div key={index + 1} className="flex-1 px-2">
                                                <button
                                                    onClick={() => setImage(index + 1)}
                                                    className={`focus:outline-none w-full rounded-lg h-24 md:h-32 bg-gray-100 flex items-center justify-center ${image === index + 1 ? 'ring-2 ring-indigo-300 ring-inset' : ''}`}
                                                >
                                                    <img src={imageUrl} alt={`Image ${index + 1}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Product Detail */}
                        <div className="md:flex-1 px-4" style={{ marginTop: "-22%" }}>
                            <section className="text-gray-700 body-font overflow-hidden bg-white">
                                <motion.div
                                    ref={teamRef}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={isTeamVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                                >
                                    <div>
                                        <h2 className="text-sm title-font text-gray-500 tracking-widest">Shirt</h2>
                                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">The Catcher in the Rye</h1>
                                        <div className="flex mb-4" style={{ marginTop: "3%" }}>
                                            <div className='flex item-center' style={{ marginTop: "1%" }}>
                                                <Rating
                                                    name="half-rating"
                                                    defaultValue={4}
                                                    precision={1}
                                                    readOnly
                                                />
                                            </div>
                                            <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                                                <a className="text-gray-500">
                                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                        <p className="leading-relaxed" style={{ marginTop: "5%" }}>Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p>
                                        <div style={{ marginTop: "3%" }}>
                                            <span className="mr-4">Color</span>
                                            <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                                            <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                                            <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button>
                                        </div>
                                        <div className="flex items-center" style={{ marginTop: "3%" }}>
                                            <span className="mr-4">Size</span>
                                            <div className="relative">
                                                <div>
                                                    {['S<62Kg', 'M<70Kg', 'L<79Kg', 'XL<85Kg', '2XL<95Kg'].map((size, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => _handleSizeClick(size)}
                                                            className={`mr-2 border-2 rounded-lg py-1 px-3 focus:outline-none ${selectedSize === size ? 'border-red-500' : 'border-gray-300'}`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center" style={{ marginTop: "3%" }}>
                                            <span className="mr-3">Số Lượng</span>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => _handleQuantityChange(-1)}
                                                    className="border-2 border-gray-300 rounded-lg w-8 h-8 focus:outline-none"
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2">{quantity}</span>
                                                <button
                                                    onClick={() => _handleQuantityChange(1)}
                                                    className="border-2 border-gray-300 rounded-lg w-8 h-8 focus:outline-none"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="ml-3 text-gray-500">{maxQuantity} sản phẩm có sẵn</span>
                                        </div>
                                        <div style={{ marginTop: "30px", display: "flex" }}>
                                            <span className="title-font font-medium text-2xl">Price: </span>
                                            <span className="title-font font-medium text-2xl" style={{ color: "#E96208", marginLeft: "10px" }}>58.000 VND</span>
                                        </div>
                                        <div className="flex mt-6">
                                            <button className=" text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"><a href='/design'>Design</a></button>
                                            <button className="ml-5 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">Order</button>
                                            <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </section>
                        </div>
                    </div>

                    {/* Product Information */}
                    <motion.div
                        ref={titleRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={isTitleVisible ? { opacity: 1, y: 0, transition: { duration: 0.5 } } : {}}
                    >
                        <div className="max-w-2xl px-4 py-8" style={{ color: "black", marginTop: "6%" }}>
                            <h2 className="text-3xl font-bold mb-6">CHI TIẾT SẢN PHẨM</h2>
                            <div className="mb-8">
                                <p className="font-semibold text-lg mb-2">Danh Mục</p>
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-600">Shopee</span>
                                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.293 6.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 010-2h10.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-600">Thời Trang Nam</span>
                                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.293 6.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 010-2h10.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-600">Áo</span>
                                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.293 6.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 010-2h10.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-600">Áo Polo</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="font-semibold text-lg mb-2">Chiều dài tay áo</p>
                                    <p className="text-gray-600">Tay ngắn</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg mb-2">Mẫu</p>
                                    <p className="text-gray-600">Trơn</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg mb-2">Rất lớn</p>
                                    <p className="text-gray-600">Có</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg mb-2">Kho hàng</p>
                                    <p className="text-gray-600">16</p>
                                </div>
                            </div>
                            <div className="mb-8">
                                <p className="font-semibold text-xl mb-4">MÔ TẢ SẢN PHẨM</p>
                                <div className="text-gray-600 space-y-4">
                                    <p>Áo Thun Nam Slimfit POLO SHIRT BASIC HUGO BOSS TRƠN khuy màu Xà Cừ Logo thêu dáng dài 6 màu hàng xuất xịn Có Big Size</p>
                                    <p>Polo Hugo Boss chuẩn xịn full ON WEB</p>
                                    <ul className="list-disc list-inside">
                                        <li>Chất vải CVC hạt nhuyễn xịn ấm, thấm hút siêu tốt, vải mềm rũ dáng dài, vải xịn ko nhăn nhé ạ</li>
                                        <li>Form 55kg - 95kg</li>
                                        <li>KHUY NÚT KHẮC LOGO, LOGO TITAN VẠT ÁO, CỔ VIỀN VÀ TAY ÁO BO DỆT TAY LEN, PHỐI CỔ, TEM TAG MAY DA 2 LỚP KO LỘ CHỈ, HÀNG XỊN LẮM LUÔN Ạ</li>
                                    </ul>
                                    <p>Polo HUGO BOSS cotton hạt dạng vải lạnh mềm:</p>
                                    <p>S M L Xl 2Xl từ 50-95kg</p>
                                    <p>Vải hiếm cực kì mềm mát mặc hè ạ</p>
                                    <ul className="list-disc list-inside">
                                        <li>Chất liệu cao cấp HUGO BOSS mềm mịn ko ngứa, thoáng mát</li>
                                        <li>Hàng xuất dư, dáng dài, form SlimFit</li>
                                        <li>Form SLIM-FIT</li>
                                        <li>Nói không với hàng fake hàng chợ</li>
                                    </ul>
                                    <p>Size S M L XL (50-90kg) ib chiều cao kg năng trước khi đặt hàng</p>
                                    <p>Size S(55-65kg)/ M(65-75kg)/ L(75-85kg)/ XL(85-90kg)</p>
                                    <p>Shop đảm bảo mang đến sản phẩm giống hình 100%</p>
                                    <p>Nếu quý khách thấy sai hình có thể hoàn hàng lại cho shop</p>
                                    <p>Sản phẩm là hàng Xuất Xịn theo đúng mô tả</p>
                                    <p>Cam kết không bán hàng nhái hàng kém chất lượng</p>
                                    <p>Không thổi phồng, Không hét giá</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feedback With Socket IO */}
                    {/* <ReviewProductComponent /> */}

                    {showScrollButton && (
                        <IconButton
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 100,
                                backgroundColor: "#E96208",
                                color: "white"
                            }}
                            onClick={_handleScrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default ProductDetailScreens;
