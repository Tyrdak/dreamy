// Graphique de tendance hebdomadaire
import React from 'react';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

interface WeeklyChartProps {
  data: { date: string; count: number }[];
  width: number;
  height: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, width, height }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = data.map((d, i) => ({
    x: padding + (i * chartWidth) / 6,
    y: padding + chartHeight - (d.count / maxCount) * chartHeight,
  }));

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaData = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;

  return (
    <Svg width={width} height={height}>
      {/* Grille */}
      {[0, 1, 2, 3, 4].map(i => (
        <Line
          key={i}
          x1={padding}
          y1={padding + (i * chartHeight) / 4}
          x2={width - padding}
          y2={padding + (i * chartHeight) / 4}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}

      <Path d={areaData} fill="#7c6df1" fillOpacity="0.2" />
      <Path d={pathData} stroke="#7c6df1" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r="6" fill="#7c6df1" />
          <Circle cx={p.x} cy={p.y} r="3" fill="#ffffff" />
        </G>
      ))}

      {data.map((d, i) => {
        const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][new Date(d.date).getDay()];
        return (
          <SvgText key={i} x={padding + (i * chartWidth) / 6} y={height - 10} fontSize="12" fill="#9ca3af" textAnchor="middle">
            {dayName}
          </SvgText>
        );
      })}

      {points.map((p, i) => (
        data[i].count > 0 && (
          <SvgText key={i} x={p.x} y={p.y - 12} fontSize="12" fill="#7c6df1" fontWeight="bold" textAnchor="middle">
            {data[i].count}
          </SvgText>
        )
      ))}
    </Svg>
  );
};

