// Graphique de tendance hebdomadaire amélioré
import React from 'react';
import Svg, { Circle, Defs, FeDropShadow, Filter, G, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

interface WeeklyChartProps {
  data: { date: string; count: number }[];
  width: number;
  height: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, width, height }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const padding = 50;
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
      {/* Grille améliorée */}
      {[0, 1, 2, 3, 4].map(i => (
        <Line
          key={i}
          x1={padding}
          y1={padding + (i * chartHeight) / 4}
          x2={width - padding}
          y2={padding + (i * chartHeight) / 4}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.6"
        />
      ))}

      {/* Zone de remplissage avec gradient */}
      <Path d={areaData} fill="url(#gradient)" />
      
      {/* Ligne principale */}
      <Path 
        d={pathData} 
        stroke="#7c6df1" 
        strokeWidth="4" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#shadow)"
      />

      {/* Points interactifs */}
      {points.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r="8" fill="#7c6df1" opacity="0.3" />
          <Circle cx={p.x} cy={p.y} r="6" fill="#7c6df1" />
          <Circle cx={p.x} cy={p.y} r="3" fill="#ffffff" />
        </G>
      ))}

      {/* Labels des jours */}
      {data.map((d, i) => {
        const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][new Date(d.date).getDay()];
        return (
          <SvgText 
            key={i} 
            x={padding + (i * chartWidth) / 6} 
            y={height - 15} 
            fontSize="13" 
            fill="#6b7280" 
            textAnchor="middle"
            fontWeight="500"
          >
            {dayName}
          </SvgText>
        );
      })}

      {/* Valeurs sur les points */}
      {points.map((p, i) => (
        data[i].count > 0 && (
          <SvgText 
            key={i} 
            x={p.x} 
            y={p.y - 15} 
            fontSize="13" 
            fill="#7c6df1" 
            fontWeight="bold" 
            textAnchor="middle"
          >
            {data[i].count}
          </SvgText>
        )
      ))}

      {/* Définitions SVG */}
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#7c6df1" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="#7c6df1" stopOpacity="0.05" />
        </LinearGradient>
        <Filter id="shadow" x="-2" y="-2" width="4" height="4">
          <FeDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7c6df1" floodOpacity="0.3"/>
        </Filter>
      </Defs>
    </Svg>
  );
};

