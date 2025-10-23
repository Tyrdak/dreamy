// Composant bouton réutilisable

import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-dream-purple active:bg-dream-dusk',
    outline: 'border-2 border-primary-500 bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-red-600 active:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-5 py-3',
    lg: 'px-6 py-4',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary-600',
    ghost: 'text-primary-600',
    danger: 'text-white',
  };

  const disabledClass = disabled || loading ? 'opacity-50' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClass}
        ${widthClass}
        rounded-xl
        flex-row
        items-center
        justify-center
        shadow-md
        ${className}
      `.trim()}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#7c6df1' : '#ffffff'} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            className={`
              ${textColorClasses[variant]}
              ${textSizeClasses[size]}
              font-semibold
              ${icon ? 'ml-2' : ''}
            `.trim()}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

