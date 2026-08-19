"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["var(--success)", "var(--primary)", "var(--accent)", "var(--warning)", "var(--destructive)"];

export function MentionChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
