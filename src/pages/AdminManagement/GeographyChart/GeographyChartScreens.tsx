import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { tokens } from "../../../theme";
import { geoFeatures } from "./DataTestGeographyFeature";
import { mockGeographyData as geographyData } from "./DataTestGeographyChart";
const GeographyChart = ({ isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <ResponsiveChoropleth
            data={geographyData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.primary[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.primary[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.primary[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.primary[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.primary[100],
                    },
                },
            }}
            features={geoFeatures.features}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            domain={[0, 300]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={isDashboard ? 80 : 1800}
            projectionTranslation={isDashboard ? [0.3, 0.4] : [-2, 1.5]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.5}
            borderColor="#ffffff"
            legends={
                !isDashboard
                    ? [
                        {
                            anchor: "bottom-left",
                            direction: "column",
                            justify: true,
                            translateX: 20,
                            translateY: -100,
                            itemsSpacing: 0,
                            itemWidth: 94,
                            itemHeight: 18,
                            itemDirection: "left-to-right",
                            itemTextColor: colors.primary[100],
                            itemOpacity: 0.85,
                            symbolSize: 18,
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemTextColor: "#ffffff",
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]
                    : <div><h1>it not show</h1></div>
            }
        />
    );
};

export default GeographyChart;
