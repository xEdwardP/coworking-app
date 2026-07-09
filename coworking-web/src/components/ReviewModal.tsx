import { useState } from 'react';
import toast from 'react-hot-toast';
import { createReview } from '../api/reviews';
import { StarRating } from './StarRating';

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
      toast.success('Gracias por tu reseña');
      onSubmitted();
      onClose();
    } catch {
      toast.error('No se pudo enviar tu reseña');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-[#2b3036] bg-[#181c20] p-6">
        <h3 className="text-lg font-extrabold text-white">Deja tu reseña</h3>
        <StarRating value={rating} onChange={setRating} />
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Cuéntanos tu experiencia (opcional)"
          rows={3}
          className="w-full rounded-lg border border-[#30363d] bg-[#111418] px-3 py-2 text-sm text-white outline-none placeholder:text-[#7f8781] focus:border-[#52a37c]"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#30363d] py-2 text-sm font-extrabold text-white hover:bg-[#20262a]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#52a37c] py-2 text-sm font-extrabold text-white hover:bg-[#5cad85] disabled:opacity-60"
          >
            {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
          </button>
        </div>
      </div>
    </div>
  );
}
