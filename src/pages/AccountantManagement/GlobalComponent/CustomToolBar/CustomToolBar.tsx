import { useState, useEffect } from 'react';
import {
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton,
    useGridApiContext,
} from '@mui/x-data-grid';
import { Badge } from '@mui/material';

const CustomToolbar = () => {
    const apiRef = useGridApiContext();
    const [filteredRowCount, setFilteredRowCount] = useState(0);

    useEffect(() => {
        const updateFilteredRowCount = () => {
            const visibleRows = apiRef.current.getVisibleRowModels();
            setFilteredRowCount(visibleRows.size);
        };

        // Update initially
        updateFilteredRowCount();

        // Subscribe to grid events to update the count
        const unsubscribeFilter = apiRef.current.subscribeEvent('filterModelChange', updateFilteredRowCount);
        const unsubscribeRows = apiRef.current.subscribeEvent('rowsSet', updateFilteredRowCount);

        // Cleanup
        return () => {
            unsubscribeFilter();
            unsubscribeRows();
        };
    }, [apiRef]);

    return (
        <GridToolbarContainer>
            <GridToolbarExport />
            <Badge color="secondary" badgeContent={filteredRowCount}>
                <GridToolbarFilterButton />
            </Badge>
        </GridToolbarContainer>
    );
};

export default CustomToolbar;
