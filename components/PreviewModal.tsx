import React, { useRef, useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, title, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const CONTENT_WIDTH = 740; // The natural width of the PDF content in pixels

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Scale down the content if it's wider than the container
        setScale(Math.min(1, containerWidth / CONTENT_WIDTH));
      }
    };

    const resizeObserver = new ResizeObserver(calculateScale);
    const containerElement = containerRef.current;
    resizeObserver.observe(containerElement);
    
    // Initial calculation after a short delay for modal animations
    const timeoutId = setTimeout(calculateScale, 50);

    return () => {
      resizeObserver.unobserve(containerElement);
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] animate-fade-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-border flex-shrink-0">
          <h2 id="preview-modal-title" className="text-xl font-bold text-text">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <CloseIcon />
          </button>
        </header>
        <div ref={containerRef} className="flex-grow p-4 overflow-auto custom-scrollbar flex justify-center items-start">
            <div
                className="bg-white rounded-lg shadow-lg flex-shrink-0"
                style={{
                    width: `${CONTENT_WIDTH}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                }}
            >
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;