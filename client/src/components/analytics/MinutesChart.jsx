import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisTick, tooltipStyle } from '../../utils/chartStyle'

const shortDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function MinutesChart({ data }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ft-border)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} tick={axisTick} minTickGap={16} />
          <YAxis tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }}
            labelFormatter={shortDate}
            formatter={(value) => [`${value} min`, 'Workout time']}
          />
          <Bar dataKey="minutes" fill="#14b8a6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MinutesChart
