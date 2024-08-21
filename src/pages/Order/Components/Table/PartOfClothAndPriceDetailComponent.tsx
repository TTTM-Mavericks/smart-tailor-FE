import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { grayColor1 } from '../../../../root/ColorSystem';
import { __handleAddCommasToNumber } from '../../../../utils/NumbericUtils';
import { DesignMaterialDetailResponse } from '../../../../models/OrderModel';

interface DesignMaterialDetail {
    detailName: string;
    minMeterSquare?: string;
    maxMeterSquare?: string;
    minPriceMaterial: string;
    maxPriceMaterial: string;
}

interface DesignMaterialData {
    detailName?: string;
    minMeterSquare?: number;
    maxMeterSquare?: number;
    minPriceMaterial?: number;
    maxPriceMaterial?: number;
}

const designMaterialColumns: ColumnData[] = [
    {
        width: 100,
        label: 'Detail Name',
        dataKey: 'detailName',
    },
    {
        width: 100,
        label: 'Min Meter Square',
        dataKey: 'minMeterSquare',
        numeric: true,
    },
    {
        width: 100,
        label: 'Max Meter Square',
        dataKey: 'maxMeterSquare',
        numeric: true,
    },
    {
        width: 150,
        label: 'Min Price Material (VND) / m²',
        dataKey: 'minPriceMaterial',
        numeric: true,
    },
    {
        width: 150,
        label: 'Max Price Material (VND) / m²',
        dataKey: 'maxPriceMaterial',
        numeric: true,
    },
];



interface ColumnData {
    dataKey: keyof DesignMaterialData;
    label: string;
    numeric?: boolean;
    width: number;
}



const DesignMaterialTableComponents: TableComponents<DesignMaterialData> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} sx={customScrollbarStyles} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed', fontSize: 12, border: 'none' }} />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} sx={{ fontSize: 12 }} />
    )),
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} sx={{ fontSize: 12 }} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} sx={{ fontSize: 12 }} />
    )),
};

const transformDesignMaterialData = (data: DesignMaterialDetail[]): DesignMaterialData[] => {
    return data.map((item) => ({
        detailName: item.detailName ?? '',
        minMeterSquare: item.minMeterSquare ? parseFloat(item.minMeterSquare) : undefined,
        maxMeterSquare: item.maxMeterSquare ? parseFloat(item.maxMeterSquare) : undefined,
        minPriceMaterial: __handleAddCommasToNumber(parseFloat(item.minPriceMaterial)) ?? 0,
        maxPriceMaterial: __handleAddCommasToNumber(parseFloat(item.maxPriceMaterial)) ?? 0,
    }));
};

const PartOfClothAndPriceDetailTableComponent: React.FC<{ designMaterialDetailData?: any }> = ({ designMaterialDetailData }) => {
    const [rows, setRows] = React.useState<DesignMaterialData[]>([]);
    const [totalPrice, setTotalPrice] = useState<{ min: number, max: number }>();

    useEffect(() => {
        if (designMaterialDetailData) {
            const transformedData = transformDesignMaterialData(designMaterialDetailData);
            setRows(transformedData);

            const getTotalPrice = () => {
                let totalMin = 0;
                let totalMax = 0;

                designMaterialDetailData.forEach((item: any) => {
                    if (item.minPriceMaterial !== undefined) {
                        totalMin += parseFloat(item.minPriceMaterial);
                    }
                    if (item.maxPriceMaterial !== undefined) {
                        totalMax += parseFloat(item.maxPriceMaterial);
                    }
                });

                return { min: totalMin, max: totalMax };
            };

            setTotalPrice(getTotalPrice());
        }
    }, [designMaterialDetailData]);

    return (
        <Paper style={{ height: 400, width: '90%', boxShadow: 'none', border: 'none', margin: '0 auto' }}>
            <TableVirtuoso
                data={rows}
                components={DesignMaterialTableComponents}
                fixedHeaderContent={() => (
                    <TableRow>
                        {designMaterialColumns.map((column) => (
                            <TableCell
                                key={column.dataKey}
                                variant="head"
                                align={column.numeric ? 'right' : 'left'}
                                style={{ width: column.width, fontWeight: 'bold' }}
                                sx={{
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
                itemContent={(index, row) => (
                    <React.Fragment>
                        {designMaterialColumns.map((column) => (
                            <TableCell
                                key={column.dataKey}
                                align={column.numeric ? 'right' : 'left'}
                            >
                                {row[column.dataKey]}
                            </TableCell>
                        ))}
                    </React.Fragment>
                )}
            />
        </Paper>
    );
};

export default PartOfClothAndPriceDetailTableComponent;

const customScrollbarStyles = {
    '&::-webkit-scrollbar': {
        width: '0.3em',
        height: '0.3em', // Horizontal scrollbar height
        borderRadius: '4px',
        backgroundColor: grayColor1,
    },
    '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        backgroundColor: grayColor1,
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#7b7b7b',
        borderRadius: '4px',
    },
};
