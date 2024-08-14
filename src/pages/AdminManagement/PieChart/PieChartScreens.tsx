import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../../theme";
import { FormControl, InputLabel, Select, MenuItem, Box, useTheme } from '@mui/material';
import { mockPieData as pieChartData } from "./PieDataTest";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from "../../../api/ApiConfig";

const PieChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [option, setOption] = useState("month");
    const color = theme.palette

    const [data, setData] = useState([])

    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.getAllExpertTailoring}`;

        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    setData(responseData.data);
                    console.log("Data received:", responseData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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
                        <MenuItem value="month"> {t(`${codeLanguage}000041`)}</MenuItem>
                        <MenuItem value="week">{t(`${codeLanguage}000042`)}</MenuItem>
                        <MenuItem value="year">{t(`${codeLanguage}000043`)}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
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
