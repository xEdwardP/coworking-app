import { useMemo } from 'react';

interface Props {
  date: string;
  occupied: { startTime: string; endTime: string }[];
  selected: string | null;
  onSelect: (hour: string) => void;
}

const HOURS = [9, 10, 11, 13, 14, 16];

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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
            className={`h-9 rounded-md border text-sm font-extrabold transition ${
              isOccupied
                ? 'cursor-not-allowed border-[#292f34] bg-[#1b1f23] text-[#6f7470] line-through'
                : isSelected
                  ? 'border-[#52a37c] bg-[#52a37c] text-white'
                  : 'border-[#2d3338] bg-[#1b1f23] text-[#f4f5f2] hover:border-[#3d4943]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
