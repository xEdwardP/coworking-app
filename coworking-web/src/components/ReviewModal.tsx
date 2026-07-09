import { useState } from 'react';
import toast from 'react-hot-toast';
import { StarRating } from './StarRating';
import { createReview } from '../api/reviews';

interface Props {
  spaceId: number;
  onClose: () => void;
  onSubmitted: () => void;
}

export function ReviewModal({ spaceId, onClose, onSubmitted }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await createReview(spaceId, { rating, comment });
      toast.success('¡Gracias por tu reseña!');
      onSubmitted();
      onClose();
    } catch {
      toast.error('No se pudo enviar tu reseña');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold">Deja tu reseña</h3>
        <StarRating value={rating} onChange={setRating} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos tu experiencia (opcional)"
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-neutral-900 text-white py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60"
          >
            {isSubmitting ? 'Enviando…' : 'Publicar reseña'}
          </button>
        </div>
      </div>
    </div>
  );
}