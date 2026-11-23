import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { tooltipStyle } from '../../utils/chartStyle'

const colors = ['#14b8a6', '#06b6d4', '#84cc16']

function MacroChart({ data }) {
  return (
    <>
      <div className="chart-box chart-small">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={3} stroke="none">
              {data.map((item, index) => (
                <Cell key={item.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        {data.map((item, index) => (
          <span key={item.name}>
            <i style={{ background: colors[index] }}></i>
            {item.name} {item.value}%
          </span>
        ))}
      </div>
    </>
  )
}

export default MacroChart
