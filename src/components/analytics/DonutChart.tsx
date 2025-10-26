// Graphique en donut amélioré pour visualiser les proportions
import React from 'react';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  width: number;
  height?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, width, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  const radius = 85;
  const innerRadius = 60;
  const centerX = width / 2;
  const centerY = height / 2;

  let currentAngle = -90;

  const createArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerR * Math.cos(startRad);
    const y1 = centerY + outerR * Math.sin(startRad);
    const x2 = centerX + outerR * Math.cos(endRad);
    const y2 = centerY + outerR * Math.sin(endRad);
    const x3 = centerX + innerR * Math.cos(endRad);
    const y3 = centerY + innerR * Math.sin(endRad);
    const x4 = centerX + innerR * Math.cos(startRad);
    const y4 = centerY + innerR * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <Svg width={width} height={height}>
      {/* Fond du donut */}
      <Circle cx={centerX} cy={centerY} r={radius} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;
        
        const path = createArc(currentAngle, endAngle, radius, innerRadius);
        currentAngle = endAngle;

        return (
          <Path 
            key={index} 
            d={path} 
            fill={item.color} 
            stroke="#ffffff" 
            strokeWidth="2"
            opacity="0.9"
          />
        );
      })}

      {/* Centre du donut avec gradient */}
      <Circle cx={centerX} cy={centerY} r={innerRadius} fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      
      {/* Texte central */}
      <SvgText
        x={centerX}
        y={centerY - 8}
        fontSize="32"
        fontWeight="bold"
        fill="#1f2937"
        textAnchor="middle"
      >
        {total}
      </SvgText>
      <SvgText
        x={centerX}
        y={centerY + 18}
        fontSize="14"
        fill="#6b7280"
        textAnchor="middle"
        fontWeight="500"
      >
        rêves
      </SvgText>
      
      {/* Légende */}
      <SvgText
        x={centerX}
        y={centerY + 35}
        fontSize="12"
        fill="#9ca3af"
        textAnchor="middle"
      >
        Types de rêves
      </SvgText>
    </Svg>
  );
};

