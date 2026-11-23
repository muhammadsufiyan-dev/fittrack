import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { tooltipStyle } from '../../utils/chartStyle'

export const categoryColors = ['#14b8a6', '#6366f1', '#f59e0b', '#ec4899']

function CategoryChart({ data }) {
  return (
    <div className="donut-wrap">
      <div className="donut-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [`${value} workouts`, name]} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={3} stroke="none">
              {data.map((item, index) => (
                <Cell key={item.name} fill={categoryColors[index % categoryColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="donut-legend">
        {data.map((item, index) => (
          <li key={item.name}>
            <span style={{ background: categoryColors[index % categoryColors.length] }}></span>
            {item.name}
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryChart
