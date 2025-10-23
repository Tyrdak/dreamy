// Graphique en barres horizontales
import React from 'react';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

interface BarChartProps {
  data: { label: string; value: number; color: string; emoji: string }[];
  width: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, width }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barHeight = 40;
  const spacing = 16;
  const chartHeight = data.length * (barHeight + spacing);

  return (
    <Svg width={width} height={chartHeight}>
      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * (width - 120);
        const y = index * (barHeight + spacing);

        return (
          <G key={index}>
            <Rect x={100} y={y} width={width - 120} height={barHeight} fill="#f3f4f6" rx={20} />
            <Rect x={100} y={y} width={barWidth} height={barHeight} fill={item.color} rx={20} />

            <SvgText x={15} y={y + barHeight / 2 + 8} fontSize="24">
              {item.emoji}
            </SvgText>

            <SvgText x={45} y={y + barHeight / 2 + 5} fontSize="14" fill="#4b5563" fontWeight="600">
              {item.label}
            </SvgText>

            <SvgText
              x={barWidth > 50 ? 110 + barWidth - 10 : 110 + barWidth + 10}
              y={y + barHeight / 2 + 5}
              fontSize="16"
              fill={barWidth > 50 ? "#ffffff" : "#7c6df1"}
              fontWeight="bold"
              textAnchor={barWidth > 50 ? "end" : "start"}
            >
              {item.value}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

