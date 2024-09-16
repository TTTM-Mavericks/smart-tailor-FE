import { ResponsiveLine } from "@nivo/line";
import { FormControl, InputLabel, Select, MenuItem, Box, useTheme } from '@mui/material';
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { mockLineData as dataLineChart } from "./DataTestLineChart";
import { useTranslation } from 'react-i18next';

const LineChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const color = theme.palette;

    const [option, setOption] = useState("month");

    const filteredData = option === "month" ? dataLineChart : [];
    console.log("filter data", filteredData, option);

    const _handleChange = (e: any) => {
        setOption(e.target.value);
    };

    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', margin: '2%' }}>
                <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: color.background.paper, borderRadius: 1 }}>
                    <InputLabel sx={{ color: color.text.primary }}>Filter by Category</InputLabel>
                    <Select
                        value={option}
                        onChange={_handleChange}
                        label="Filter by Category"
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: color.grey[300],
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: color.primary.main,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: color.primary.main,
                            },
                        }}
                    >
                        <MenuItem value="month">{t(`${codeLanguage}000041`)}</MenuItem>
                        <MenuItem value="week">{t(`${codeLanguage}000042`)}</MenuItem>
                        <MenuItem value="year">{t(`${codeLanguage}000043`)}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <ResponsiveLine
                data={filteredData}
                theme={{
                    axis: {
                        domain: {
                            line: {
                                stroke: colors.primary[200],
                            },
                        },
                        legend: {
                            text: {
                                fill: colors.primary[200],
                            },
                        },
                        ticks: {
                            line: {
                                stroke: colors.primary[200],
                                strokeWidth: 1,
                            },
                            text: {
                                fill: colors.primary[200],
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: colors.primary[200],
                        },
                    },
                    tooltip: {
                        container: {
                            color: colors.primary[300],
                        },
                    },
                }}
                animate={false}
                tooltip={({ point }) => (
                    <div
                        style={{
                            background: colors.primary[100],
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                            color: colors.primary[300],
                        }}
                    >
                        <div>x: {point.data.x?.toString()}</div>
                        <div>y: {point.data.y?.toString()}</div>
                    </div>
                )}
                fill={[]}
                colors={{ scheme: 'nivo' }}
                defs={[]}
                layers={['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends']}
                debugSlices={false}
                enableSlices={false}
                debugMesh={false}
                isInteractive
                lineWidth={3}
                areaBaselineValue={0}
                areaBlendMode={"normal"}
                areaOpacity={0.1} // Adjusted from 10 to 0.1 as opacity should be between 0 and 1
                crosshairType="bottom"
                enablePoints
                enablePointLabel={false}
                enableArea={false}
                enableCrosshair={false}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=" >-.2f"
                curve="cardinal"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendOffset: 36,
                    truncateTickAt: 0
                }}
                axisLeft={{
                    tickValues: 5,
                    tickSize: 3,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendOffset: -40,
                    legendPosition: "middle",
                }}
                enableGridX={false}
                enableGridY={true}
                pointSize={8}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="data.yFormatted"
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: colors.primary[200],
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemBackground: colors.primary[100],
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
            />
        </>
    );
};

export default LineChart;
