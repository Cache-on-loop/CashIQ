import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useGetTransactionsSummaryQuery } from "state/api";

const BreakdownChart = ({ isDashboard = false }) => {
  const [summaryType, setSummaryType] = useState("yearly");
  const [summaryValue, setSummaryValue] = useState(new Date().getFullYear().toString());
  const theme = useTheme();
  const { data, isLoading } = useGetTransactionsSummaryQuery({  userId: "661b0357d1e7a45088b26b1d",type: summaryType, value: summaryValue });

  useEffect(() => {
    // Fetch data based on summaryType and summaryValue
    // This logic runs whenever summaryType or summaryValue changes
    // No need to call a separate fetchData function
  }, [summaryType, summaryValue]);

  const handleTypeChange = (event) => {
    setSummaryType(event.target.value);
  };

  const handleValueChange = (event) => {
    setSummaryValue(event.target.value);
  };

  if (!data || isLoading) return "Loading...";

  const colors = [
    theme.palette.secondary[500],
    theme.palette.secondary[300],
    theme.palette.secondary[100],
    theme.palette.secondary[200],
    theme.palette.secondary[400],
    theme.palette.secondary[600],
    theme.palette.secondary[700],
    theme.palette.secondary[800],
    theme.palette.secondary[900],
  ];
  
  const formattedData = Object.entries(data.summary).map(([category, sales], i) => ({
    id: category,
    label: category,
    value: sales,
    color: colors[i % colors.length],
  }));

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: "1rem" }}>
        <InputLabel id="summary-type-label">Summary Type</InputLabel>
        <Select
          labelId="summary-type-label"
          id="summary-type"
          value={summaryType}
          onChange={handleTypeChange}
          label="Summary Type"
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
        </Select>
      </FormControl>
      {summaryType !== "daily" && (
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: "1rem" }}>
          <InputLabel id="summary-value-label">Summary Value</InputLabel>
          <Select
            labelId="summary-value-label"
            id="summary-value"
            value={summaryValue}
            onChange={handleValueChange}
            label="Summary Value"
          >
            {/* Provide options based on summaryType */}
            {summaryType === "monthly" && (
              Array.from({ length: 12 }, (_, i) => {
                const month = new Date(new Date().getFullYear(), i, 1);
                return (
                  <MenuItem key={i} value={month.toISOString()}>
                    {month.toLocaleString("default", { month: "long" })}
                  </MenuItem>
                );
              })
            )}
            {summaryType === "yearly" && (
              Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <MenuItem key={i} value={year.toString()}>
                    {year}
                  </MenuItem>
                );
              })
            )}
          </Select>
        </FormControl>
      )}
      <ResponsivePie
        data={formattedData}
        // Other props remain unchanged
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        colors={{ datum: "data.color" }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        // Remove borders
  enableSliceLabels={false} // Enable slice labels
  
  enableRadialLabels={false} 
 
        
        enableArcLinkLabels={false}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: isDashboard ? 20 : 0,
            translateY: isDashboard ? 50 : 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
           
          },
        ]}
      
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard ? "translate(-75%, -170%)" : "translate(-50%, -100%)",
        }}
      >
      <Box
  position="absolute"
  top="95px"
  left="-30px"
  transform="translate(-50%, -50%)"
  color={theme.palette.secondary[400]}
  textAlign="center"
  pointerEvents="none"
>
  <Typography variant="h6">
    {!isDashboard && "Total:"} ${data.totalAmount}
  </Typography>
</Box>
  
      
      </Box>
    </Box>
  );
};

export default BreakdownChart;
