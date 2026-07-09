import { useMemo } from 'react';

interface Props {
  date: string;
  occupied: { startTime: string; endTime: string }[];
  selected: string | null;
  onSelect: (hour: string) => void;
}

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);

export function TimeSlotPicker({ date, occupied, selected, onSelect }: Props) {
  const occupiedHours = useMemo(() => {
    const set = new Set<number>();
    occupied.forEach((slot) => {
      const start = new Date(slot.startTime).getHours();
      const end = new Date(slot.endTime).getHours();
      for (let h = start; h < end; h++) set.add(h);
    });
    return set;
  }, [occupied]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {HOURS.map((hour) => {
        const label = `${hour.toString().padStart(2, '0')}:00`;
        const isOccupied = occupiedHours.has(hour);
        const value = `${date}T${label}:00`;
        const isSelected = selected === value;

        return (
          <button
            key={hour}
            type="button"
            disabled={isOccupied}
            onClick={() => onSelect(value)}
            className={`rounded-lg border py-2 text-sm font-medium transition ${
              isOccupied
                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed line-through'
                : isSelected
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}