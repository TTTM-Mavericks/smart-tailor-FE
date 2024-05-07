import { ResponsiveLine } from "@nivo/line";
import { Card, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import React, { useEffect, useState } from "react";
import { mockLineData as dataLineChart } from "./DataTestLineChart";
import { useTranslation } from 'react-i18next';

const LineChart = ({ isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [option, setOption] = useState("month");

    const filteredData = option === "month" ? dataLineChart : [];
    console.log("filter data" + filteredData + option);

    const handleChange = (e: any) => {
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
                <Card sx={{ backgroundColor: `${colors.primary[100]} !important`, width: "18%", color: `${colors.primary[100]}`, marginTop: "2%", marginLeft: "60%" }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={option}
                        exclusive
                        onChange={handleChange}
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
                colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
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
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: isDashboard ? undefined : "transportation",
                    legendOffset: 36,
                    legendPosition: "middle",
                    truncateTickAt: 0
                }}
                axisLeft={{
                    orient: "left",
                    tickValues: 5,
                    tickSize: 3,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: isDashboard ? undefined : "",
                    legendOffset: -40,
                    legendPosition: "middle",
                }}
                enableGridX={false}
                enableGridY={true}
                pointSize={8}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
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
                                    itemBackground: colors.primary[200],
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
