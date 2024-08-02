import { Typography, useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { tokens } from "../../../theme";
import { geoFeatures } from "./DataTestGeographyFeature";
import { mockGeographyData as geographyData } from "./DataTestGeographyChart";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";

const GeographyChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
            <Typography m="40px" variant="h5">
                {t(codeLanguage + '000040')}
            </Typography>
            <ResponsiveChoropleth
                data={geographyData}
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
                projectionType="mercator"
                enableGraticule={true}
                isInteractive={true}
                graticuleLineColor={colors.primary[200]}
                graticuleLineWidth={1}
                features={geoFeatures.features}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                colors="nivo"
                domain={[0, 300]}
                unknownColor="#666666"
                label="properties.name"
                valueFormat=".2s"
                projectionScale={1800}
                projectionTranslation={[0.5, 1.2]}
                projectionRotation={[255, 0, 0]}
                borderWidth={1.5}
                borderColor={colors.primary[200]}
                legends={[
                    {
                        anchor: "left",
                        direction: "column",
                        justify: true,
                        translateX: 120,
                        translateY: -100,
                        itemsSpacing: 0,
                        itemWidth: 94,
                        itemHeight: 18,
                        itemDirection: "left-to-right",
                        itemTextColor: colors.primary[200],
                        itemOpacity: 0.85,
                        symbolSize: 18,
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemTextColor: colors.primary[200],
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

export default GeographyChart;
