import { FormControl, InputLabel, Select, MenuItem, Box, useTheme } from '@mui/material';
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../../theme";
import { mockBarData as barChartData } from "./DataTestBarChart";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const BarChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const color = theme.palette
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
                margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
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
                    modifiers: [["darker", 1.6]],
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
                role="application"
                barAriaLabel={function (e) {
                    return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
                }}
            />
        </>

    );
};

export default BarChart;
