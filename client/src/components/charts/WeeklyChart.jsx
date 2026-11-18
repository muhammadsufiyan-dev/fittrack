import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisTick, tooltipStyle } from '../../utils/chartStyle'

function WeeklyChart({ data }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ft-border)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }} contentStyle={tooltipStyle} />
          <Bar dataKey="burned" name="Calories" fill="#14b8a6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeeklyChart
