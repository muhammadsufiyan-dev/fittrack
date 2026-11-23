import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { axisTick, tooltipStyle } from '../../utils/chartStyle'

const shortDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function CaloriesChart({ data }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ft-border)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} tick={axisTick} minTickGap={16} />
          <YAxis tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip contentStyle={tooltipStyle} labelFormatter={shortDate} formatter={(value) => `${value} kcal`} />
          <Legend iconType="circle" />
          <Line type="monotone" dataKey="eaten" name="Eaten" stroke="#6366f1" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="burned" name="Burned" stroke="#14b8a6" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CaloriesChart
