import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { grayColor1 } from '../../../../root/ColorSystem';
import { height } from '@mui/system';

interface Data {
    hsCode: number,
    materialName: string,
    category: string,
    unit: number,
    quantity: number,
    minPrice: number,
    maxPrice: number
}

interface ColumnData {
    dataKey: keyof Data;
    label: string;
    numeric?: boolean;
    width: number;
}

type Sample = [number, string, string, number, number, number, number];

const sample: readonly Sample[] = [
    [1, 'Vải cotton', 'Vải', 6.0, 24, 4.0, 4],
    [2, 'Vải nỉ', 'Vải', 9.0, 37, 4.3, 5],
    [3, 'Chỉ alizabet', 'Chỉ', 16.0, 24, 6.0, 6],
    [4, 'Cúc hoàng kim', 'Chỉ', 3.7, 67, 4.3, 7],
    [5, 'vải nilon', 'Vải', 16.0, 49, 3.9, 9],
];

function createData(
    hsCode: number,
    materialName: string,
    category: string,
    unit: number,
    quantity: number,
    minPrice: number,
    maxPrice: number
): Data {
    return { hsCode, materialName, category, unit, quantity, minPrice, maxPrice };
}

const columns: ColumnData[] = [
    {
        width: 100,
        label: 'Hs code',
        dataKey: 'hsCode',
    },
    {
        width: 200,
        label: 'Name',
        dataKey: 'materialName',
    },
    {
        width: 120,
        label: 'Category',
        dataKey: 'category',
    },
    {
        width: 50,
        label: 'Unit',
        dataKey: 'unit',
        numeric: true,
    },
    {
        width: 50,
        label: 'Quantity',
        dataKey: 'quantity',
        numeric: true,
    },
    {
        width: 120,
        label: 'Min price',
        dataKey: 'minPrice',
        numeric: true,
    },
    {
        width: 120,
        label: 'Max price',
        dataKey: 'maxPrice',
        numeric: true,
    },
];

const rows: Data[] = Array.from({ length: 20 }, (_, index) => {
    const randomSelection: Sample = sample[Math.floor(Math.random() * sample.length)];
    return createData(...randomSelection);
});

const VirtuosoTableComponents: TableComponents<Data> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} sx={customScrollbarStyles} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed', fontSize: 12 }} />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} sx={{fontSize: 12}} />
    )),
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} sx={{fontSize: 12}}/>,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} sx={{fontSize: 12}}/>
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
                    style={{ width: column.width }}
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

type MaterialDetailTableProps = {

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


const MaterialDetailTableComponent: React.FC<MaterialDetailTableProps> = ({ }) => {
    return (
        <Paper style={{ height: 400, width: '100%' }}>
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
