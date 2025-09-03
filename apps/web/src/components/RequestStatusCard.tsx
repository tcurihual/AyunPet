import React from 'react';

type RequestStatusCardProps = {
  petName: string;
  petImage: string;
  rating: number;
  description: string;
  submitterName: string;
  submitterAvatar: string;
  date: string;
  status: 'en_espera' | 'aceptado' | 'rechazado';
};

// Rating
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};

// Estado
const StatusBadge: React.FC<{ status: RequestStatusCardProps['status'] }> = ({ status }) => {
  const statusStyles = {
    en_espera: { text: 'En espera...', bg: 'bg-[#23282B]', text_color: 'text-white' },
    aceptado: { text: 'Aceptado', bg: 'bg-green-500', text_color: 'text-white' },
    rechazado: { text: 'Rechazado', bg: 'bg-red-500', text_color: 'text-white' },
  };

  const currentStatus = statusStyles[status];

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${currentStatus.bg} ${currentStatus.text_color}`}
    >
      {currentStatus.text}
    </span>
  );
};


export default function RequestStatusCard({
  petName,
  petImage,
  rating,
  description,
  submitterName,
  submitterAvatar,
  date,
  status,
}: RequestStatusCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-yellow-50 rounded-2xl shadow-md overflow-hidden p-6 border border-yellow-200 flex gap-6 items-start">
      {/* Columna Izquierda: Contenido */}
      <div className="flex-1">
        <StarRating rating={rating} />
        <h3 className="text-2xl font-bold text-gray-800 mt-2">{petName}</h3>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
        <div className="flex items-center gap-3 mt-4">
          <img src={submitterAvatar} alt={submitterName} className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-gray-700 text-sm">{submitterName}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Imagen y Botones */}
      <div className="flex flex-col items-end gap-4">
        <img src={petImage} alt={petName} className="w-40 h-40 rounded-full object-cover border-4 border-[#E5D5BE] shadow-lg" />
        <div className="flex items-center gap-2 mt-2">
          <button className="px-4 py-1.5 text-sm bg-[#8d4925] text-white rounded-lg hover:bg-[#644C34] transition">
            Informacion
          </button>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}