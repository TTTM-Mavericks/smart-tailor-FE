import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../../theme";
import { Card, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { mockPieData as pieChartData } from "./PieDataTest";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const PieChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [option, setOption] = useState("month");

    const filteredData = option === "month" ? pieChartData : [];
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
                <Typography variant="h5">
                    Pie Chart
                </Typography>
                <Card sx={{ backgroundColor: `${colors.primary[100]} !important`, width: "18%", color: `${colors.primary[100]}`, marginTop: "2%", marginLeft: "60%" }}>
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
            <ResponsivePie
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
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={colors.primary[200]}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                enableArcLabels={false}
                arcLabelsRadiusOffset={0.4}
                arcLabelsSkipAngle={7}
                arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                }}
                defs={[
                    {
                        id: "dots",
                        type: "patternDots",
                        background: "inherit",
                        color: colors.primary[200],
                        size: 4,
                        padding: 1,
                        stagger: true,
                    },
                    {
                        id: "lines",
                        type: "patternLines",
                        background: "inherit",
                        color: colors.primary[200],
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10,
                    },
                ]}
                legends={[
                    {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: colors.primary[200],
                        itemDirection: "left-to-right",
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: "circle",
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemTextColor: colors.primary[200],
                                },
                            },
                        ],
                    },
                ]}
            />
        </>
    );
};

export default PieChart;
