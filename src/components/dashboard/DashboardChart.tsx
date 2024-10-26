"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type BarData = {
  name: string;
  [key: string]: string | number;
};

type DashboardChartProps = {
  title: string;
  data: BarData[];
  className?: string;
  colors?: { [key: string]: string };
};

const DEFAULT_COLORS = ["#4f46e5", "#10b981", "#f97316", "#ef4444", "#8b5cf6", "#ec4899"];
export function DashboardChart({ title, data, className, colors = {} }: DashboardChartProps) {
  const keys = data.length > 0 && Object.keys(data[0]).filter((key) => key !== "name");

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>
      <div className={cn("h-[400px] w-full", className)}>
        <ResponsiveContainer width="100%" height="100%">
          {data.length > 0 ? (
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={50}
            >
              <CartesianGrid strokeDasharray="3" />
              <XAxis
                dataKey="name"
                allowDecimals={true}
                hide={false}
                orientation="bottom"
                width={0}
                height={30}
                mirror={false}
                xAxisId={0}
                tickCount={5}
                type="category"
                padding={{ left: 0, right: 0 }}
                allowDataOverflow={false}
                scale="auto"
                reversed={false}
                allowDuplicatedCategory={true}
              />
              <YAxis
                allowDuplicatedCategory={true}
                allowDecimals={true}
                hide={false}
                orientation="left"
                width={60}
                height={0}
                mirror={false}
                yAxisId={0}
                tickCount={5}
                type="number"
                padding={{ top: 0, bottom: 0 }}
                allowDataOverflow={false}
                scale="auto"
                reversed={false}
              />
              <Tooltip />
              <Legend />
              {keys && keys.slice(0, 6).map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[key] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
              ))}
            </BarChart>)
            : <div className="flex items-center justify-center text-center text-lg text-gray-200">Loading</div>}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
