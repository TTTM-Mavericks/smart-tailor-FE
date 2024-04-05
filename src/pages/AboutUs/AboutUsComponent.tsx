import React, { useState, useEffect } from 'react';
import HeaderAboutUsComponent from './HeaderAboutUsComponent';
import CarouselComponent from './CarouselComponent';

// AboutUsComponent Component
const AboutUsComponent: React.FC = () => {
    return (
        <div>
            {/* <HeaderAboutUsComponent /> */}
            <div style={{ display: "flex" }}>
                <div>
                    <p style={{ color: "red" }}>Spotlight
                        More than 300 of the most covetable luxury brands at ION Orchard ready for you to discover.
                    </p>
                </div>
                <CarouselComponent />
            </div>
        </div>
    );
};

export default AboutUsComponent;
