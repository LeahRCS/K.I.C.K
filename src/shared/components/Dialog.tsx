// @ts-nocheck
import { MouseEvent, ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  closeOnClickOutside?: boolean;
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  children,
  closeOnClickOutside = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(
    function handleShowOrCloseDialog() {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      } else if (!open && dialog.open) {
        dialog.close();
        document.body.style.overflow = 'unset';
      }
      
      return () => {
        document.body.style.overflow = 'unset';
      }
    },
    [open],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const dialog = dialogRef.current;
      if (!closeOnClickOutside || !dialog) return;

      const rect = dialog.getBoundingClientRect();
      const clickedOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (clickedOutside) {
        onClose();
      }
    },
    [closeOnClickOutside, onClose],
  );

  return createPortal(
    <dialog
      ref={dialogRef}
      className={twJoin(
        "top-[10vh] max-h-[80vh] w-full max-w-4xl m-auto p-0",
        "bg-white dark:bg-neutral-900 brutalist-border text-neutral-900 dark:text-white",
        "backdrop:bg-black/80 backdrop:backdrop-blur-sm open:flex open:flex-col"
      )}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className="flex justify-end p-4 border-b-4 border-neutral-900 dark:border-white">
        <button 
          onClick={onClose}
          className="font-black text-xl hover:text-[#d90429] transition-colors uppercase tracking-widest px-2"
        >
          [ FECHAR ]
        </button>
      </div>
      <div className="overflow-y-auto p-6 md:p-10">
        {children}
      </div>
    </dialog>,
    document.body,
  );
}
