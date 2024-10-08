import React from 'react';

const PickedOrderScreen = () => {
    // TODO MUTIL LANGUAGE

    return (
        <div className="h-screen w-screen bg-gray-50 flex items-center">
            <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
                <div className="w-full lg:w-1/2 mx-8">
                    <div className="text-7xl text-orange-500 font-dark font-extrabold mb-8">Order is picked</div>
                    <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                        Sorry, you too late to pick this order.
                    </p>
                    <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                        Let's try with other orders.
                    </p>

                    <a href="/" className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-orange-600 active:bg-red-600 hover:bg-red-700">Back to homepage</a>
                </div>
                <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
                    <img src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg" className="" alt="Page not found" />
                </div>
            </div>
        </div>
    );
}
export default PickedOrderScreen;
