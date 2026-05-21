import React, { useEffect } from "react";
import Loading from "./Loading";

const Modal = ({
  type = "success",
  message,
  error,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const isLoading = type === "loading";
  const isSuccess = type === "success";
  const isError = type === "error";
  const isConfirm = type === "confirm";

  useEffect(() => {
    if ((isSuccess || isError) && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[90%] max-w-md min-h-[180px] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
        {isLoading && <Loading text={message || "Carregando..."} />}

        {isSuccess && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-5">
              <span className="text-white text-5xl font-bold">✓</span>
            </div>
            <p className="text-sm text-gray-800">{message}</p>
          </>
        )}

        {isError && (
          <>
            <div className="w-20 h-20 rounded-full border-[8px] border-red-500 flex items-center justify-center mb-5">
              <span className="text-red-500 text-5xl font-bold">×</span>
            </div>
            <p className="text-sm text-gray-800">{message}</p>
            {error && <p className="text-xs text-gray-600 mt-1">#{error}</p>}
          </>
        )}

        {isConfirm && (
          <>
            <p className="text-base text-gray-900 mb-10">
              Deseja realmente fazer isso?
            </p>

            <div className="flex gap-6">
              <button
                onClick={onCancel}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                X Cancelar
              </button>

              <button
                onClick={onConfirm}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;