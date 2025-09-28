
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Service, Theme } from '../types';
import SchedulePDFTemplate from '../components/SchedulePDFTemplate';

declare const html2canvas: any;
declare const jspdf: any;

export const generateSchedulePdf = async (
  service: Service,
  activities: Activity[],
  theme: Theme
) => {
  const container = document.createElement('div');
  // Styling for off-screen rendering. IMPORTANT: This needs to be in the DOM layout flow but invisible.
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.zIndex = '-1'; // Put it behind everything
  container.style.opacity = '0'; // Hide it from view
  container.style.pointerEvents = 'none'; // Prevent interaction
  const templateWidth = 800; // The fixed width of our template
  container.style.width = `${templateWidth}px`;
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    // Render the component once to get all the elements
    await new Promise<void>((resolve) => {
      root.render(
        <SchedulePDFTemplate
          service={service}
          activities={activities}
          theme={theme}
        />
      );
      setTimeout(resolve, 500); // Allow time for layout and fonts
    });

    const headerEl = container.querySelector<HTMLElement>('#pdf-header');
    const dayBlocks = Array.from(container.querySelectorAll<HTMLElement>('.pdf-day-block'));
    
    if (!headerEl) {
        throw new Error('PDF template header element not found.');
    }
    
    const pdf = new jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const HTML2CANVAS_SCALE = window.devicePixelRatio || 2;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Page layout
    const PAGE_MARGIN_SIDES = 35;
    const CONTENT_WIDTH = pdfWidth - 2 * PAGE_MARGIN_SIDES;
    const PAGE_MARGIN_TOP = 30;
    const PAGE_MARGIN_BOTTOM = 40;
    const DAY_BLOCK_SPACING_PDF = 15;

    // --- 1. Process Header (First Page Only) ---
    const headerCanvas = await html2canvas(headerEl, {
      scale: HTML2CANVAS_SCALE,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const headerImgData = headerCanvas.toDataURL('image/png');
    const headerPdfHeight = headerCanvas.height * (CONTENT_WIDTH / headerCanvas.width);

    pdf.addImage(headerImgData, 'PNG', PAGE_MARGIN_SIDES, PAGE_MARGIN_TOP, CONTENT_WIDTH, headerPdfHeight);
    
    let yOnPage = PAGE_MARGIN_TOP + headerPdfHeight + 20;

    // --- 2. Process each day-block individually ---
    for (const block of dayBlocks) {
        const blockCanvas = await html2canvas(block, {
            scale: HTML2CANVAS_SCALE,
            useCORS: true,
            backgroundColor: '#ffffff',
        });
        
        const blockPdfHeight = blockCanvas.height * (CONTENT_WIDTH / blockCanvas.width);
        
        // If the block doesn't fit on the current page, add a new one.
        // The check `yOnPage > PAGE_MARGIN_TOP` prevents adding a new page for the very first item if it's taller than a page.
        if (yOnPage + blockPdfHeight > pdfHeight - PAGE_MARGIN_BOTTOM && yOnPage > PAGE_MARGIN_TOP) {
            pdf.addPage();
            yOnPage = PAGE_MARGIN_TOP;
        }
        
        const blockImgData = blockCanvas.toDataURL('image/png');
        pdf.addImage(blockImgData, 'PNG', PAGE_MARGIN_SIDES, yOnPage, CONTENT_WIDTH, blockPdfHeight);
        
        yOnPage += blockPdfHeight + DAY_BLOCK_SPACING_PDF;
    }

    // --- 3. Footer with Page Numbers ---
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor('#6b7280'); // gray-500
        const pageNumText = `${i} / ${totalPages}`;
        pdf.text(pageNumText, pdfWidth - PAGE_MARGIN_SIDES, pdfHeight - (PAGE_MARGIN_BOTTOM / 2) + 5, { align: 'right' });
    }
    
    const safeServiceName = service.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    pdf.save(`planning-${safeServiceName}.pdf`);

  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Une erreur est survenue lors de la génération du PDF.");
  } finally {
    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  }
};
