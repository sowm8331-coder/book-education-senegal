import { jsPDF } from 'jspdf';

export function buildServerPdfDocument(doc: {
  id?: string;
  title?: string;
  level?: string;
  category?: string;
  author?: string;
  description?: string;
  content?: string;
  exercises?: Array<{ question: string; solution?: string }>;
}): Buffer {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 16;
  let currentPage = 1;

  const docLevel = doc.level || 'Enseignement Sénégalais';
  const docCategory = doc.category || 'Pédagogie';
  const docTitle = doc.title || 'Document Officiel';
  const docAuthor = doc.author || "Ministère de l'Éducation Nationale";

  const addHeader = (pNum: number) => {
    // Flag bands: Green, Gold, Red
    pdf.setFillColor(22, 101, 52); // Green
    pdf.rect(0, 0, pageWidth / 3, 3, 'F');
    pdf.setFillColor(234, 179, 8); // Gold
    pdf.rect(pageWidth / 3, 0, pageWidth / 3, 3, 'F');
    pdf.setFillColor(225, 29, 72); // Red
    pdf.rect((pageWidth / 3) * 2, 0, pageWidth / 3, 3, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(22, 101, 52);
    pdf.text("RÉPUBLIQUE DU SÉNÉGAL • MINISTÈRE DE L'ÉDUCATION NATIONALE", pageWidth / 2, 8, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Fascicule Pédagogique Officiel — Book Education Sénégal", pageWidth / 2, 12, { align: 'center' });

    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(margin, 14, pageWidth - margin, 14);
  };

  const addFooter = (pNum: number) => {
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Book Education Sénégal • ${docLevel} — ${docCategory}`, margin, pageHeight - 7);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Page ${pNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  addHeader(currentPage);
  currentY = 22;

  // Header Box
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, currentY, contentWidth, 24, 3, 3, 'FD');

  pdf.setFillColor(79, 70, 229);
  pdf.roundedRect(margin + 4, currentY + 4, 28, 6, 1.5, 1.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text(String(docLevel), margin + 18, currentY + 8.2, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(79, 70, 229);
  pdf.text(String(docCategory).toUpperCase(), margin + 36, currentY + 8.2);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  const titleLines = pdf.splitTextToSize(docTitle, contentWidth - 8);
  pdf.text(titleLines.slice(0, 2), margin + 4, currentY + 16);

  currentY += 30;

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Auteur / Établissement : ${docAuthor}`, margin, currentY);
  currentY += 6;

  if (doc.description) {
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(margin, currentY, contentWidth, 12, 2, 2, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(51, 65, 85);
    const descLines = pdf.splitTextToSize(doc.description, contentWidth - 6);
    pdf.text(descLines.slice(0, 2), margin + 3, currentY + 5);
    currentY += 16;
  }

  const rawContent = doc.content || doc.description || 'Document pédagogique officiel conforme aux programmes sénégalais.';
  const paragraphs = rawContent.split('\n');

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(30, 41, 59);

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) {
      currentY += 3;
      continue;
    }

    const isH1 = /^[I|V|X]+\.\s+/i.test(trimmed) || (trimmed === trimmed.toUpperCase() && trimmed.length > 5 && trimmed.length < 50);
    const isH2 = /^[0-9]+\.\s+/i.test(trimmed) || /^[A-Z]\.\s+/i.test(trimmed);

    if (isH1) {
      currentY += 4;
      if (currentY > pageHeight - 30) {
        addFooter(currentPage);
        pdf.addPage();
        currentPage++;
        addHeader(currentPage);
        currentY = 22;
      }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(22, 101, 52);
      pdf.text(trimmed, margin, currentY);
      currentY += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 41, 59);
      continue;
    }

    if (isH2) {
      currentY += 2;
      if (currentY > pageHeight - 30) {
        addFooter(currentPage);
        pdf.addPage();
        currentPage++;
        addHeader(currentPage);
        currentY = 22;
      }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 41, 59);
      pdf.text(trimmed, margin + 2, currentY);
      currentY += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      continue;
    }

    const lines = pdf.splitTextToSize(trimmed, contentWidth);
    for (const line of lines) {
      if (currentY > pageHeight - 20) {
        addFooter(currentPage);
        pdf.addPage();
        currentPage++;
        addHeader(currentPage);
        currentY = 22;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(30, 41, 59);
      }
      pdf.text(line, margin, currentY);
      currentY += 4.5;
    }
  }

  // Official exercises
  if (doc.exercises && doc.exercises.length > 0) {
    currentY += 6;
    if (currentY > pageHeight - 40) {
      addFooter(currentPage);
      pdf.addPage();
      currentPage++;
      addHeader(currentPage);
      currentY = 22;
    }

    pdf.setFillColor(238, 242, 255);
    pdf.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(67, 56, 202);
    pdf.text("EXERCICES D'APPLICATION & ANNALES D'EXAMEN", margin + 4, currentY + 5.5);
    currentY += 12;

    for (let i = 0; i < doc.exercises.length; i++) {
      const ex = doc.exercises[i];
      if (currentY > pageHeight - 35) {
        addFooter(currentPage);
        pdf.addPage();
        currentPage++;
        addHeader(currentPage);
        currentY = 22;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(79, 70, 229);
      pdf.text(`Exercice ${i + 1} :`, margin, currentY);
      currentY += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(30, 41, 59);
      const qLines = pdf.splitTextToSize(ex.question, contentWidth - 4);
      for (const line of qLines) {
        if (currentY > pageHeight - 20) {
          addFooter(currentPage);
          pdf.addPage();
          currentPage++;
          addHeader(currentPage);
          currentY = 22;
        }
        pdf.text(line, margin + 4, currentY);
        currentY += 4.5;
      }

      if (ex.solution) {
        currentY += 2;
        if (currentY > pageHeight - 25) {
          addFooter(currentPage);
          pdf.addPage();
          currentPage++;
          addHeader(currentPage);
          currentY = 22;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(22, 101, 52);
        pdf.text("Corrigé officiel :", margin + 4, currentY);
        currentY += 4;

        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8.5);
        pdf.setTextColor(51, 65, 85);
        const solLines = pdf.splitTextToSize(ex.solution, contentWidth - 8);
        for (const line of solLines) {
          if (currentY > pageHeight - 20) {
            addFooter(currentPage);
            pdf.addPage();
            currentPage++;
            addHeader(currentPage);
            currentY = 22;
          }
          pdf.text(line, margin + 6, currentY);
          currentY += 4;
        }
      }
      currentY += 4;
    }
  }

  addFooter(currentPage);

  const arrayBuf = pdf.output('arraybuffer');
  return Buffer.from(arrayBuf);
}
