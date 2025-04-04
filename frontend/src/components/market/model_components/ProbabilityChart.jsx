import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-gray-300 text-sm">
          {new Date(label).toLocaleTimeString()}
        </p>
        <p className="text-green-400 text-sm">Yes: {payload[0].value}%</p>
        <p className="text-red-400 text-sm">No: {payload[1].value}%</p>
        <p className="text-blue-400 text-sm">
          Total Stakes: {payload[2]?.payload?.totalStakes || 0}
        </p>
      </div>
    );
  }
  return null;
};

const ProbabilityChart = ({ dataLoading, probabilityData }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6">
      <h4 className="text-white text-sm font-medium mb-4">
        Probability Trends
      </h4>
      {dataLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={probabilityData}>
            <defs>
              <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#10B981"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#10B981"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#EF4444"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#EF4444"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              stroke="#888"
              tickFormatter={(tick) =>
                new Date(tick).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis stroke="#888" domain={[0, 100]} />
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="yesProbability"
              name="Yes"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorYes)"
            />
            <Area
              type="monotone"
              dataKey="noProbability"
              name="No"
              stroke="#EF4444"
              fillOpacity={1}
              fill="url(#colorNo)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProbabilityChart;