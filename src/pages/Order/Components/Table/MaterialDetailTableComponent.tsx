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
import { MaterialDetailInterface } from '../../../../models/DesignModel';

interface Data {
    hsCode?: number,
    materialName?: string,
    category?: string,
    unit?: string,
    quantity?: number,
    minPrice?: number,
    maxPrice?: number
}

interface ColumnData {
    dataKey: keyof Data;
    label: string;
    numeric?: boolean;
    width: number;
}


const columns: ColumnData[] = [
    {
        width: 100,
        label: 'HSCode',
        dataKey: 'hsCode',
    },
    {
        width: 120,
        label: 'Name',
        dataKey: 'materialName',
    },
    {
        width: 50,
        label: 'Category',
        dataKey: 'category',
    },
    {
        width: 50,
        label: 'Unit',
        dataKey: 'unit',
    },
    {
        width: 50,
        label: 'Quantity',
        dataKey: 'quantity',
        numeric: true,
    },
    {
        width: 150,
        label: 'Min price (VND) / m²',
        dataKey: 'minPrice',
        numeric: true,
    },
    {
        width: 150,
        label: 'Max price (VND) / m²',
        dataKey: 'maxPrice',
        numeric: true,
    },
];

const VirtuosoTableComponents: TableComponents<Data> = {
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

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
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
    );
}

function rowContent(_index: number, row: Data) {
    return (
        <React.Fragment>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    align={column.numeric ? 'right' : 'left'}
                >
                    {row[column.dataKey]}
                </TableCell>
            ))}
        </React.Fragment>
    );
}

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


type MaterialDetailTableProps = {
    materialDetailData?: MaterialDetailInterface[];
    onGetMaterialPrice?: (price: any) => void;
}

const MaterialDetailTableComponent: React.FC<MaterialDetailTableProps> = ({ materialDetailData, onGetMaterialPrice }) => {
    const [rows, setRows] = React.useState<Data[]>([]);
    const [materialTotalPrice, setMaterialTotalPrice] = useState<{ min: number, max: number }>();

    useEffect(() => {
        if (materialDetailData) {
            const transformedData = transformMaterialDetailData(materialDetailData);
            setRows(transformedData);
    
            const getTotalMaterialPrice = () => {
                let totalMin = 0;
                let totalMax = 0;
    
                materialDetailData.forEach(item => {
                    // Add a check to ensure minPrice and maxPrice are defined
                    if (item.minPrice !== undefined) {
                        totalMin += item.minPrice;
                    }
                    if (item.maxPrice !== undefined) {
                        totalMax += item.maxPrice;
                    }
                });
    
                return { min: totalMin, max: totalMax };
            };
    
            // Update state with the total prices
            setMaterialTotalPrice(getTotalMaterialPrice());
        }
    }, [materialDetailData]);
    

    useEffect(() => {
        if (onGetMaterialPrice) {
            onGetMaterialPrice(materialTotalPrice)
        }
    }, [onGetMaterialPrice])


    return (
        <Paper style={{ height: 300, width: '90%', boxShadow: 'none', border: 'none', margin: '0 auto' }}>
            <TableVirtuoso
                data={rows}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}

export default MaterialDetailTableComponent;

const transformMaterialDetailData = (materialDetailData: MaterialDetailInterface[]): Data[] => {
    return materialDetailData.map((materialDetail) => ({
        hsCode: materialDetail.materialResponse?.hsCode ?? 0,
        materialName: materialDetail.materialResponse?.materialName ?? '',
        category: materialDetail.materialResponse?.categoryName ?? '',
        unit: materialDetail.materialResponse?.unit, // Assuming unit should be a number
        quantity: materialDetail.quantity, // Placeholder, update this if quantity is available in the data
        minPrice: __handleAddCommasToNumber(materialDetail?.minPrice) ?? 0,
        maxPrice: __handleAddCommasToNumber(materialDetail.maxPrice) ?? 0,
    }));
};
