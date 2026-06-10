import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../../data/treasury.utils';

/**
 * PDF BUILDER (Level 6: The Microscope)
 * ------------------------------------------------------------------
 * Logic engine for generating branded, corporate financial statements.
 * Transforms raw JSON ledger data into a print-perfect PDF.
 */

export const generateTreasuryStatement = (data, summary, filters, currency = 'UGX') => {
  // 1. Initialize Document (A4 Portrait)
  const doc = new jsPDF('p', 'mm', 'a4');
  const brandPrimary = [14, 165, 233]; // The brand-primary blue (RGB)
  const textMain = [30, 41, 59];
  const textMuted = [100, 116, 139];

  // 2. DRAW BRAND HEADER
  doc.setFillColor(248, 250, 252); // Light Slate BG for header
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo placeholder / Text Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.text("CITADEL", 15, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("TREASURY & LIQUIDITY DIVISION", 15, 26);

  // Statement Meta (Right Aligned)
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 195, 15, { align: 'right' });
  doc.text(`Statement Period: ${filters.dateRange.start} - ${filters.dateRange.end}`, 195, 20, { align: 'right' });
  doc.text(`Auth ID: TX-${Math.random().toString(36).toUpperCase().substring(2, 10)}`, 195, 25, { align: 'right' });

  // 3. EXECUTIVE SUMMARY BOX
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 45, 180, 25, 2, 2, 'S');
  
  // Gross Volume
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("TOTAL GROSS VOLUME", 25, 53);
  doc.setFontSize(14);
  doc.setTextColor(textMain[0], textMain[1], textMain[2]);
  doc.text(formatCurrency(summary.grossVolume, currency), 25, 62);

  // Platform Yield
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("PLATFORM YIELD", 95, 53);
  doc.setFontSize(14);
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.text(formatCurrency(summary.netYield, currency), 95, 62);

  // Net Payouts
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("OPERATOR PAYOUTS", 155, 53);
  doc.setFontSize(14);
  doc.setTextColor(textMain[0], textMain[1], textMain[2]);
  doc.text(formatCurrency(summary.grossVolume - summary.netYield, currency), 155, 62);

  // 4. THE TRANSACTION TABLE
  doc.autoTable({
    startY: 80,
    head: [['Date/Time', 'Transaction ID', 'Partner/Operator', 'Gateway', 'Amount']],
    body: data.map(tx => [
      new Date(tx.created_at).toLocaleDateString(),
      tx.id.substring(0, 12).toUpperCase(),
      tx.partners?.company_name || 'N/A',
      tx.payment_gateway,
      formatCurrency(tx.gross_amount, currency)
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [30, 41, 59], 
      fontSize: 9, 
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: { 
      fontSize: 8, 
      textColor: [71, 85, 105],
      cellPadding: 4 
    },
    columnStyles: {
      4: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] }
    },
    margin: { left: 15, right: 15 }
  });

  // 5. FOOTER & COMPLIANCE
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      "This document is a computer-generated statement and requires no physical signature. Citadel Treasury is a regulated liquidity platform.",
      105, 285, { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
  }

  // 6. SAVE
  const fileName = `Statement_${filters.dateRange.start}_to_${filters.dateRange.end}.pdf`;
  doc.save(fileName);
};