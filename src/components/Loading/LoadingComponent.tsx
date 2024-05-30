import React, { useEffect, useState } from 'react';
import style from './LoadingStyle.module.scss'
type LoadingProps = {
    isLoading: boolean,
    time?: number;
    ringStyle?: React.CSSProperties
    containerStyle?: React.CSSProperties
}
const LoadingComponent: React.FC<LoadingProps> = ({ isLoading, time, containerStyle, ringStyle }) => {
    // ---------------UseState Variable---------------//
    const [isHide, setIsHide] = useState<boolean> (false);
    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//
    // ---------------FunctionHandler---------------//

    return (
        <div>
            <div hidden={!isLoading} style={containerStyle} className={`${style.container}`}>
                <div style={ringStyle} className={`${style.ring}`}></div>
                <div style={ringStyle} className={`${style.ring}`}></div>
                <div style={ringStyle} className={`${style.ring}`}></div>
                <div style={ringStyle} className={`${style.ring}`}></div>
                <div className={`${style.text}`}>Loading</div>
            </div>
        </div>
    );
};


export default LoadingComponent;