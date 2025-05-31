
import React from "react";


interface PotvrdiBrisanjeApartmanaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemId: string | number;
  naziv: string;
}

const PotvrdiBrisanjeApartmana: React.FC<PotvrdiBrisanjeApartmanaProps> = ({
  isOpen,
  onClose,
  onConfirm,
  naziv,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Potvrda Brisanja</h2>
        <p className="mb-6">
          Da li ste sigurni da želite da obrišete  {naziv}?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 bg-white rounded hover:bg-gray-600  hover:text-white"
          >
            Otkaži
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-red-700 bg-white rounded hover:bg-red-500 hover:text-white"
          >
            Obriši
          </button>
        </div>
      </div>

    </div>
  );
};

export default PotvrdiBrisanjeApartmana;