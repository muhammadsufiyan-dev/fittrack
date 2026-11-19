import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisTick, tooltipStyle } from '../../utils/chartStyle'

const shortDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function ProgressChart({ data, label, unit }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ft-border)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis
            domain={[(min) => Math.floor(min - 1), (max) => Math.ceil(max + 1)]}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={shortDate}
            formatter={(value) => [`${value} ${unit}`, label]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#14b8a6', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProgressChart
