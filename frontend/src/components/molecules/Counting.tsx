import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { FiMinus, FiPlus } from 'react-icons/fi';

type CountingProps = {
  initialCount?: number;
  onDecrement: () => void;
  onIncrement: () => void;
  minCount?: number;
  maxCount?: number;
  disabled?: boolean;
};

export default function Counting({
  initialCount = 0,
  minCount = 0,
  maxCount = Infinity,
  onDecrement,
  onIncrement,
  disabled,
}: CountingProps) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleDecrement = () => {
    if (count > minCount) {
      setCount((prev) => {
        const newCount = prev - 1;
        return newCount;
      });
      onDecrement();
    }
  };

  const handleIncrement = () => {
    if (count < maxCount) {
      setCount((prev) => {
        const newCount = prev + 1;
        return newCount;
      });
      onIncrement();
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 border rounded-lg w-max p-1">
      <Button
        size="icon"
        variant="ghost"
        className="w-8 h-8"
        disabled={disabled}
        onClick={handleDecrement}>
        <FiMinus />
      </Button>
      <p className="text-md">{count}</p>
      <Button
        size="icon"
        variant="ghost"
        className="w-8 h-8"
        disabled={disabled}
        onClick={handleIncrement}>
        <FiPlus />
      </Button>
    </div>
  );
}
