import React from 'react';

const WaitingProcessComponent: React.FC = () => {
    const dotsAnimation = `
        @keyframes hideUnhide {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
        }
    `;

    return (
        <div className="bg-gradient-to-r from-orange-200 to-yellow-100 min-h-screen flex items-center justify-center">
            <style>
                {`
                    ${dotsAnimation}
                    .dot {
                        animation: hideUnhide 1.5s infinite;
                        font-size: 4rem; /* Increased the font size */
                        color: gray;
                    }
                    .dot:nth-child(2) {
                        animation-delay: 0.5s;
                    }
                    .dot:nth-child(3) {
                        animation-delay: 1s;
                    }
                `}
            </style>
            <div className="w-full max-w-4xl p-8 m-4 bg-white shadow-2xl rounded-3xl transform hover:scale-105 transition-transform duration-500 animate-fade-in-up">
                <div className="text-center pt-8">
                    <div className="flex justify-center items-center mb-4">
                        <h4 className="text-5xl font-extrabold text-orange-500 animate-bounce">Processing</h4>
                        <div className="flex space-x-1 ml-2 -mt-8">
                            <p className="dot">.</p>
                            <p className="dot">.</p>
                            <p className="dot">.</p>
                        </div>
                    </div>
                    <p className="text-2xl font-medium py-8 text-gray-700">
                        Your information had been sent to the system
                    </p>
                    <p className="text-2xl pb-8 px-12 font-medium text-gray-600">
                        Waiting for the approval or rejection by the system. We will send the result to your email.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-full transform hover:scale-110 transition-transform duration-300 shadow-lg">
                            <a href='/'>HOME</a>
                        </button>
                        <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-full transform hover:scale-110 transition-transform duration-300 shadow-lg">
                            <a href='/'>Contact Us</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingProcessComponent;
