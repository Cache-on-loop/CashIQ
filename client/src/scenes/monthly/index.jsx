import React, { useMemo, useState } from "react";
import { Box, useTheme, Select, MenuItem } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetMonthlyQuery } from "state/api";

const Monthly = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data } = useGetMonthlyQuery({ userId: "661b0357d1e7a45088b26b1d", year: selectedYear }); // Replace "userId" with the actual userId

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const [formattedData] = useMemo(() => {
    if (!data || !data.monthlySavings) return [];

    const { monthlySavings, monthlySpendingCap } = data;
    const totalAmountLine = {
      id: "Monthly Expenditure",
      color: theme.palette.secondary.main,
      data: [],
    };
    const monthlySavingLine = {
      id: "Monthly Saving",
      color: theme.palette.secondary[600],
      data: [],
    };

    monthlySavings.forEach(({ month, totalAmount, monthlySaving }) => {
      const lineColor = totalAmount > monthlySpendingCap ? "red" : theme.palette.secondary.main;
      totalAmountLine.data = [
        ...totalAmountLine.data,
        { x: month, y: totalAmount },
      ];
      monthlySavingLine.data = [
        ...monthlySavingLine.data,
        { x: month, y: monthlySaving },
      ];
    });

    // Add a red horizontal line at the monthly saving cap
    const redLine = {
      id: "Monthly Saving Cap",
      color: "red",
      data: [{ x: monthlySavings[0].month, y: monthlySpendingCap }, { x: monthlySavings[monthlySavings.length - 1].month, y: monthlySpendingCap }]
    };

    const formattedData = [totalAmountLine, monthlySavingLine, redLine];
    return [formattedData];
  }, [data, theme.palette.secondary.main, theme.palette.secondary[600], theme.palette.primary.main]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
      <Box display="flex" alignItems="center" mb={2}>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          variant="outlined"
          sx={{ marginRight: "1rem" }}
        >
          {/* Provide options based on available years */}
          {Array.from({ length: 10 }, (_, i) => {
            const yearOption = currentYear - i;
            return (
              <MenuItem key={i} value={yearOption}>
                {yearOption}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Box height="75vh" position="relative">
        {data ? (
          <ResponsiveLine
            data={formattedData}
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
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 9,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 150,
                itemHeight: 30,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Monthly;
