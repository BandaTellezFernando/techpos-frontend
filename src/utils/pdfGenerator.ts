// src/utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 1. Le decimos a TypeScript qué datos trae cada producto del carrito
export interface ItemTicket {
  nombre: string;
  cantidad: number;
  precioFinal: number;
  requiereImei?: boolean;
  imei1?: string;
}

// 2. Le decimos a TypeScript qué datos trae el resumen de caja
export interface ItemReporte {
  metodo: string;
  transacciones: number;
  recaudadoBs: number;
}

export const generarTicketPDF = (numeroTicket: string, carrito: ItemTicket[], total: number, metodoPago: string) => {
  // Formato ticket térmico (80mm de ancho)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 200] });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("VIRGEN DE COPACABANA", 40, 10, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ticket: ${numeroTicket}`, 40, 16, { align: 'center' });
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 40, 20, { align: 'center' });
  
  doc.line(5, 24, 75, 24);
  
  let y = 28;
  carrito.forEach(item => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.cantidad}x ${item.nombre}`, 5, y);
    y += 4;
    
    if (item.requiereImei && item.imei1) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(`IMEI: ${item.imei1}`, 5, y);
      y += 4;
    }
    
    doc.setFontSize(9);
    doc.text(`Bs. ${item.precioFinal.toFixed(2)}`, 75, y - 4, { align: 'right' });
    y += 2;
  });
  
  doc.line(5, y, 75, y);
  y += 6;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("TOTAL:", 5, y);
  doc.text(`Bs. ${total.toFixed(2)}`, 75, y, { align: 'right' });
  
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pago: ${metodoPago}`, 5, y);
  
  y += 10;
  doc.setFontSize(8);
  doc.text("¡Gracias por su compra!", 40, y, { align: 'center' });
  
  // Abre el PDF en una nueva pestaña (o lo descarga en móvil)
  window.open(doc.output('bloburl'), '_blank');
};

export const generarReportePDF = (fechaInicio: string, fechaFin: string, resumen: ItemReporte[], granTotal: number) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Cierre de Caja", 14, 20);
  
  doc.setFontSize(11);
  doc.text(`Fechas: ${fechaInicio} al ${fechaFin}`, 14, 30);
  doc.text(`Total Recaudado: Bs. ${granTotal.toFixed(2)}`, 14, 36);

  const tableData = resumen.map(r => [
    r.metodo,
    r.transacciones.toString(),
    `Bs. ${r.recaudadoBs.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Método de Pago', 'Transacciones', 'Monto Recaudado']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [225, 29, 72] } // Color Ruby Accent
  });

  doc.save(`Reporte_Caja_${fechaInicio}.pdf`);
};

// UTILIDAD PARA CERRAR SESIÓN (Importa esto en SidebarGerente y donde necesites)
export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  window.location.href = '/';
};