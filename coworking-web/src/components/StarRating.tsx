import { useState } from 'react';
import { Star } from 'lucide-react';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readOnly, size = 20 }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(null)}
          onClick={() => onChange?.(star)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star
            size={size}
            className={star <= display ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
          />
        </button>
      ))}
    </div>
  );
}