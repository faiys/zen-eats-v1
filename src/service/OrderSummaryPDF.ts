import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { OrderSummary } from './Manage';

const RED: [number, number, number] = [220, 38, 38];
const DARK: [number, number, number] = [15, 23, 42];
const GREY: [number, number, number] = [100, 116, 139];

// Last table end position (set by jspdf-autotable)
function lastTableY(doc: jsPDF): number {
    return (doc as any).lastAutoTable?.finalY ?? 0;
}

// Build and download Order Summary PDF: header, date, then item -> users per category
export function exportOrderSummaryPDF(summary: OrderSummary) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 40;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...RED);
    doc.text("ZenEats", marginX, 50);
    doc.setTextColor(...DARK);
    doc.setFontSize(14);
    doc.text("Order Summary", marginX, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text(`Date: ${summary.date}`, pageWidth - marginX, 50, { align: "right" });
    doc.text(`Total Orders: ${summary.totalOrders}`, pageWidth - marginX, 66, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, 82, pageWidth - marginX, 82);

    if (summary.categories.length === 0) {
        doc.setTextColor(...DARK);
        doc.setFontSize(11);
        doc.text("No orders for today.", marginX, 110);
        doc.save(`Order_Summary_${summary.date}.pdf`);
        return;
    }

    // Item -> ordered users, per category
    summary.categories.forEach((cat, index) => {
        let y = index === 0 ? 106 : lastTableY(doc) + 24;
        if (y > doc.internal.pageSize.getHeight() - 80) {
            doc.addPage();
            y = 50;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...RED);
        doc.text(`${cat.name} (${cat.count})`, marginX, y);

        autoTable(doc, {
            startY: y + 8,
            margin: { left: marginX, right: marginX },
            head: [["Item", "Count", "Ordered By"]],
            body: cat.items.map((item) => [item.name, String(item.count), item.users.join(", ")]),
            theme: "striped",
            headStyles: { fillColor: [254, 226, 226], textColor: DARK, fontStyle: "bold" },
            styles: { fontSize: 10, cellPadding: 6, valign: "top" },
            columnStyles: {
                0: { cellWidth: 140, fontStyle: "bold" },
                1: { cellWidth: 50, halign: "center" }
            }
        });
    });

    doc.save(`Order_Summary_${summary.date}.pdf`);
}
