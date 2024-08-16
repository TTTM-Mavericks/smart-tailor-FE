import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../../theme";
import { FormControl, InputLabel, Select, MenuItem, Box, useTheme, Typography } from '@mui/material';
import { mockPieData as pieChartData } from "./PieDataTest";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from "../../../api/ApiConfig";
import { __getToken } from "../../../App";

const PieChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [option, setOption] = useState("month");
    const color = theme.palette;

    const [totalUserDetails, setTotalUserDetail] = useState([]);

    useEffect(() => {
        const fetchTotalUserDetail = async () => {
            try {
                const response = await axios.get(
                    `${baseURL + versionEndpoints.v1 + '/user' + functionEndpoints.chart.calculateTotalOfUser}`,
                    {
                        headers: {
                            Authorization: `Bearer ${__getToken()}`,
                        }
                    }
                );
                setTotalUserDetail(response.data.data || []);
            } catch (error) {
                console.error('Error fetching order status details:', error);
            } finally {
                console.error('Error fetching order status details');

            }
        };
        fetchTotalUserDetail();
    }, []);

    const pieChartData = totalUserDetails.map((item: any) => ({
        id: item.first,
        value: parseInt(item.second, 10),
    }));


    const _handleChange = (e: any) => {
        setOption(e.target.value);
    };

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
            <Typography style={{ marginTop: "2%", marginLeft: "2%" }}>
                <h1>Total User Appear In Smart Tailor</h1>
            </Typography>
            <ResponsivePie
                data={pieChartData}
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
                        itemsSpacing: 90,
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
