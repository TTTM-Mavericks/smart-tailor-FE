import { ResponsiveLine } from "@nivo/line";
import { Card, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { mockLineData as dataLineChart } from "./DataTestLineChart";
import { useTranslation } from 'react-i18next';

const LineChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [option, setOption] = useState("month");

    const filteredData = option === "month" ? dataLineChart : [];
    console.log("filter data" + filteredData + option);

    const _handleChange = (e: any) => {
        setOption(e.target.value)
    }
    // const [dataLineChart, setDataLineChart] = useState([])
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const apiURL = "";
    //     fetch(apiURL)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch data');
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             setDataLineChart(data)
    //         })
    //         .catch(err => {
    //             setError(err.message);
    //         })
    // }, [])

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <>
            <div style={{ display: "flex", margin: "2%" }}>
                <Typography variant="h5">
                    Line Chart
                </Typography>
                <Card sx={{ backgroundColor: `${colors.primary[600]} !important`, width: "19%", color: `${colors.primary[100]}`, marginTop: "2%", marginLeft: "60%" }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={option}
                        exclusive
                        onChange={_handleChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="month" sx={{ color: colors.primary[200], fontWeight: "bold" }}>
                            {t(codeLanguage + '000041')}
                        </ToggleButton>
                        <ToggleButton value="year" sx={{ color: colors.primary[200], fontWeight: "bold" }}>
                            {t(codeLanguage + '000042')}
                        </ToggleButton>
                        <ToggleButton value="week" sx={{ color: colors.primary[200], fontWeight: "bold" }}>
                            {t(codeLanguage + '000043')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Card>
            </div>
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
                        <div>x: {point.data.x}</div>
                        <div>y: {point.data.y}</div>
                    </div>
                )}
                fill={[]}
                colors={{ scheme: 'nivo' }}
                defs={[]}
                layers={['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends']}
                sliceTooltip={{ text: 'Some tooltip text' }}
                debugSlices={false}
                enableSlices={false}
                debugMesh={false}
                isInteractive
                lineWidth={3}
                areaBaselineValue={0}
                areaBlendMode={"normal"}
                areaOpacity={10}
                borderColor=""
                role=""
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
                    orient: "bottom",
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    tickValues: [1.1, 2.1, 3.5, 5.5]
                }}
                axisLeft={{
                    tickValues: 5,
                    tickSize: 3,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'count',
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
                pointLabelYOffset={- 12}
                enableTouchCrosshair={true}
                useMesh={true}
                legends={
                    [
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
