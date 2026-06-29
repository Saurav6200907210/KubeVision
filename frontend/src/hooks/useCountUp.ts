import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, animate } from 'framer-motion';

export function useCountUp(endValue: number, duration: number = 2) {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const animation = animate(count, endValue, {
      duration,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });
    return animation.stop;
  }, [endValue, duration, count]);

  return displayValue;
}
