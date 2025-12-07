import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ATSDistributionChartProps {
  distribution: { low: number; medium: number; high: number };
}

export function ATSDistributionChart({ distribution }: ATSDistributionChartProps) {
  const data = [
    { name: "Low (<50)", value: distribution.low, color: "hsl(0, 84%, 60%)" },
    { name: "Medium (50-75)", value: distribution.medium, color: "hsl(38, 92%, 50%)" },
    { name: "High (>75)", value: distribution.high, color: "hsl(152, 69%, 40%)" },
  ].filter(d => d.value > 0);

  const total = distribution.low + distribution.medium + distribution.high;

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📊 ATS Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-muted-foreground text-sm">No data yet</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📊 ATS Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
