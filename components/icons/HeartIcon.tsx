import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type HeartIconVariant = 'outline' | 'solid';

export interface HeartIconProps {
  width?: number;
  height?: number;
  color: string;
  variant?: HeartIconVariant;
}

const OUTLINE_PATH =
  'm8.256 12.711-.082.082-.09-.082c-3.882-3.523-6.45-5.853-6.45-8.215 0-1.635 1.227-2.861 2.862-2.861 1.259 0 2.485.817 2.918 1.929h1.52c.434-1.112 1.66-1.93 2.919-1.93 1.635 0 2.86 1.227 2.86 2.862 0 2.362-2.566 4.692-6.457 8.215ZM11.853 0a4.916 4.916 0 0 0-3.679 1.7A4.916 4.916 0 0 0 4.496 0C1.978 0 0 1.97 0 4.496c0 3.082 2.78 5.607 6.99 9.425L8.173 15l1.186-1.079c4.21-3.817 6.989-6.343 6.989-9.425C16.349 1.97 14.37 0 11.853 0Z';

const SOLID_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

function HeartIconComponent({
  width = 17,
  height = 15,
  color,
  variant = 'outline',
}: HeartIconProps) {
  if (variant === 'solid') {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path fill={color} d={SOLID_PATH} />
      </Svg>
    );
  }
  return (
    <Svg width={width} height={height} fill="none">
      <Path fill={color} d={OUTLINE_PATH} />
    </Svg>
  );
}

export const HeartIcon = memo(HeartIconComponent);
