import { Card, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../../theme";
import { mockBarData as barChartData } from "./DataTestBarChart";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const BarChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [option, setOption] = useState("month");

    const filteredData = option === "month" ? barChartData : [];
    console.log("filter data" + filteredData + option);

    const _handleChange = (e: any) => {
        setOption(e.target.value)
    }

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
                <Typography variant="h5" >
                    Bar Chart
                </Typography>
                <Card sx={{ backgroundColor: `${colors.primary[100]} !important`, width: "19%", color: `${colors.primary[100]}`, marginTop: "2%", marginLeft: "60%" }}>
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
            <ResponsiveBar
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
                keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
                indexBy="brand"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
                defs={[
                    {
                        id: "dots",
                        type: "patternDots",
                        background: "inherit",
                        color: "#38bcb2",
                        size: 4,
                        padding: 1,
                        stagger: true,
                    },
                    {
                        id: "lines",
                        type: "patternLines",
                        background: "inherit",
                        color: "#eed312",
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10,
                    },
                ]}
                borderColor={{
                    from: "color",
                    modifiers: [["darker", "1.6"]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "country",
                    legendPosition: "middle",
                    legendOffset: 32,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "food",
                    legendPosition: "middle",
                    legendOffset: -40,
                }}
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                }}
                legends={[
                    {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
                role="application"
                barAriaLabel={function (e) {
                    return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
                }}
            />
        </>

    );
};

export default BarChart;
