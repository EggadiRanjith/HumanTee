/**
 * Invoice PDF Generator
 * Client-side PDF generation using jsPDF
 * Generates a professional invoice with order details, items, and pricing
 */

import jsPDF from 'jspdf';
import type { Order } from '@/app/types/order.types';

const BRAND = {
    name: 'HUMANTEE',
    tagline: 'Premium Heavyweight Handcrafted T-Shirts',
    website: 'www.humantee.in',
    email: 'humanteeteam@gmail.com',
    phone: '+91 7780-661493',
};

// Colors
const BLACK = '#000000';
const DARK = '#1a1a1a';
const GRAY = '#666666';
const LIGHT_GRAY = '#999999';
const LINE_COLOR = '#e0e0e0';
const ACCENT = '#2d2d2d';

function formatCurrency(amount: number): string {
    return `Rs. ${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function generateInvoice(order: Order): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // ═══════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════

    // Brand name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(DARK);
    doc.text(BRAND.name, margin, y + 8);

    // Invoice label (right side)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(GRAY);
    doc.text('TAX INVOICE', pageWidth - margin, y + 2, { align: 'right' });

    doc.setFontSize(9);
    doc.text(`Invoice #: ${order.orderNumber}`, pageWidth - margin, y + 8, { align: 'right' });
    doc.text(`Date: ${formatDate(order.createdAt)}`, pageWidth - margin, y + 13, { align: 'right' });

    // Brand tagline
    doc.setFontSize(7);
    doc.setTextColor(LIGHT_GRAY);
    doc.text(BRAND.tagline, margin, y + 14);

    y += 22;

    // Divider
    doc.setDrawColor(LINE_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // ═══════════════════════════════════════════
    // BILLING / SHIPPING INFO
    // ═══════════════════════════════════════════

    const colWidth = contentWidth / 2;

    // Sold By
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(LIGHT_GRAY);
    doc.text('SOLD BY', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(DARK);
    doc.text(BRAND.name, margin, y + 5);
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text(BRAND.email, margin, y + 10);
    doc.text(BRAND.phone, margin, y + 15);
    doc.text(BRAND.website, margin, y + 20);

    // Ship To
    if (order.address) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(LIGHT_GRAY);
        doc.text('SHIP TO', margin + colWidth, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(DARK);
        doc.text(order.address.fullName, margin + colWidth, y + 5);
        doc.setFontSize(8);
        doc.setTextColor(GRAY);

        const addressLines: string[] = [];
        if (order.address.addressLine1) addressLines.push(order.address.addressLine1);
        if (order.address.addressLine2) addressLines.push(order.address.addressLine2);
        addressLines.push(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`);
        addressLines.push(order.address.country || 'India');

        addressLines.forEach((line, i) => {
            doc.text(line, margin + colWidth, y + 10 + i * 4.5);
        });
    }

    y += 32;

    // Divider
    doc.setDrawColor(LINE_COLOR);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // ═══════════════════════════════════════════
    // ITEMS TABLE
    // ═══════════════════════════════════════════

    // Table header
    const colProduct = margin;
    const colVariant = margin + contentWidth * 0.45;
    const colQty = margin + contentWidth * 0.62;
    const colPrice = margin + contentWidth * 0.74;
    const colTotal = pageWidth - margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(LIGHT_GRAY);
    doc.text('PRODUCT', colProduct, y);
    doc.text('VARIANT', colVariant, y);
    doc.text('QTY', colQty, y);
    doc.text('PRICE', colPrice, y);
    doc.text('TOTAL', colTotal, y, { align: 'right' });

    y += 3;
    doc.setDrawColor(LINE_COLOR);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    if (order.items) {
        order.items.forEach((item) => {
            const unitPrice = Number(item.unitPrice || 0);
            const qty = Number(item.quantity || 0);
            const lineTotal = Number(item.lineTotal || unitPrice * qty);

            // Product name (may need truncation)
            doc.setTextColor(DARK);
            const productName = item.productNameSnapshot.length > 30
                ? item.productNameSnapshot.substring(0, 28) + '...'
                : item.productNameSnapshot;
            doc.text(productName, colProduct, y);

            // Variant
            doc.setTextColor(GRAY);
            doc.text(item.variantLabelSnapshot || '-', colVariant, y);

            // Quantity
            doc.text(String(qty), colQty, y);

            // Unit price
            doc.text(formatCurrency(unitPrice), colPrice, y);

            // Line total
            doc.setTextColor(DARK);
            doc.text(formatCurrency(lineTotal), colTotal, y, { align: 'right' });

            y += 7;
        });
    }

    // Bottom line of items
    y += 2;
    doc.setDrawColor(LINE_COLOR);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // ═══════════════════════════════════════════
    // TOTALS
    // ═══════════════════════════════════════════

    const totalsX = margin + contentWidth * 0.6;
    const totalsValueX = pageWidth - margin;

    doc.setFontSize(8.5);
    doc.setTextColor(GRAY);

    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', totalsX, y);
    doc.setTextColor(DARK);
    doc.text(formatCurrency(Number(order.subtotal || order.totalAmount)), totalsValueX, y, { align: 'right' });
    y += 6;

    // Shipping
    if (order.shippingAmount !== undefined) {
        doc.setTextColor(GRAY);
        doc.text('Shipping', totalsX, y);
        doc.setTextColor(DARK);
        doc.text(
            Number(order.shippingAmount) === 0 ? 'FREE' : formatCurrency(Number(order.shippingAmount)),
            totalsValueX, y, { align: 'right' }
        );
        y += 6;
    }

    // Discount
    if (order.discountAmount && Number(order.discountAmount) > 0) {
        doc.setTextColor('#16a34a'); // green
        doc.text('Discount', totalsX, y);
        doc.text(`-${formatCurrency(Number(order.discountAmount))}`, totalsValueX, y, { align: 'right' });
        y += 6;
    }

    // Tax (GST inclusive note)
    doc.setTextColor(GRAY);
    doc.setFontSize(7);
    doc.text('* GST included in product prices (MRP)', totalsX, y);
    y += 8;

    // Total line
    doc.setDrawColor(ACCENT);
    doc.setLineWidth(0.8);
    doc.line(totalsX, y, pageWidth - margin, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(BLACK);
    doc.text('TOTAL', totalsX, y);
    doc.text(formatCurrency(Number(order.totalAmount)), totalsValueX, y, { align: 'right' });

    y += 4;
    doc.setDrawColor(ACCENT);
    doc.setLineWidth(0.8);
    doc.line(totalsX, y, pageWidth - margin, y);

    // ═══════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════

    const footerY = doc.internal.pageSize.getHeight() - 25;

    doc.setDrawColor(LINE_COLOR);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text('Thank you for shopping with HumanTee!', pageWidth / 2, footerY + 6, { align: 'center' });

    doc.setFontSize(7);
    doc.setTextColor(LIGHT_GRAY);
    doc.text(
        `${BRAND.website}  |  ${BRAND.email}  |  ${BRAND.phone}`,
        pageWidth / 2, footerY + 11, { align: 'center' }
    );
    doc.text(
        'This is a computer-generated invoice and does not require a signature.',
        pageWidth / 2, footerY + 16, { align: 'center' }
    );

    // Save
    doc.save(`HumanTee-Invoice-${order.orderNumber}.pdf`);
}
