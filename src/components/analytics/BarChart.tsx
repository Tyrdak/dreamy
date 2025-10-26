// Graphique en barres horizontales amélioré
import React from 'react';
import Svg, { Defs, G, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface BarChartProps {
  data: { label: string; value: number; color: string; emoji: string }[];
  width: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, width }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barHeight = 50;
  const spacing = 20;
  const chartHeight = data.length * (barHeight + spacing);

  return (
    <Svg width={width} height={chartHeight}>
      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * (width - 140);
        const y = index * (barHeight + spacing);

        return (
          <G key={index}>
            {/* Fond de la barre */}
            <Rect 
              x={120} 
              y={y} 
              width={width - 140} 
              height={barHeight} 
              fill="#f8fafc" 
              rx={25} 
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            
            {/* Barre principale avec gradient */}
            <Rect 
              x={120} 
              y={y} 
              width={barWidth} 
              height={barHeight} 
              fill={item.color} 
              rx={25}
              opacity="0.9"
            />
            
            {/* Effet de brillance */}
            <Rect 
              x={120} 
              y={y} 
              width={barWidth} 
              height={barHeight / 2} 
              fill="url(#shine)" 
              rx={25}
              opacity="0.3"
            />

            {/* Emoji dans un cercle */}
            <Rect 
              x={20} 
              y={y + 5} 
              width={40} 
              height={40} 
              fill="#ffffff" 
              rx={20}
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <SvgText x={40} y={y + barHeight / 2 + 8} fontSize="20" textAnchor="middle">
              {item.emoji}
            </SvgText>

            {/* Label */}
            <SvgText 
              x={70} 
              y={y + barHeight / 2 + 6} 
              fontSize="15" 
              fill="#374151" 
              fontWeight="600"
            >
              {item.label}
            </SvgText>

            {/* Valeur */}
            <SvgText
              x={barWidth > 60 ? 120 + barWidth - 15 : 120 + barWidth + 15}
              y={y + barHeight / 2 + 6}
              fontSize="16"
              fill={barWidth > 60 ? "#ffffff" : item.color}
              fontWeight="bold"
              textAnchor={barWidth > 60 ? "end" : "start"}
            >
              {item.value}
            </SvgText>
          </G>
        );
      })}
      
      {/* Définitions SVG */}
      <Defs>
        <LinearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

