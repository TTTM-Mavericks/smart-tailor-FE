import React from 'react';
import { useLocation } from 'react-router-dom';

const RowDetails: React.FC = () => {
    const location = useLocation();
    const rowData = location.state;

    return (
        <div>
            <h1 style={{ color: "black" }}>Row Details</h1>
            <pre style={{
                color:
                    "black"
            }}>{JSON.stringify(rowData, null, 2)}</pre>
        </div>
    );
};

export default RowDetails;
