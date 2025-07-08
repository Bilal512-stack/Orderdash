import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import 'jspdf-autotable'; // Import nécessaire pour l'extension

// Déclaration de type pour étendre jsPDF
declare module 'jspdf' {
interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
    lastAutoTable?: {
    finalY: number;
    };
    // Autres extensions si nécessaire
}
}

interface OTData {
orderId: string;
createdAt: string;
sender: {
    name: string;
    address: string;
    phone: string;
};
nature: string;
transportMode: string;
agreedPrice: number;
loadingDate: string;
loadingHour: string;
route: {
    from: string;
    to: string;
};
deliveryDate: string;
deliveryHour: string;
volume?: string;
weight: string;
commitments?: string;
paymentConditions?: string;
notes?: string;
}

export function OTDownloadButton({ data }: { data: OTData }) {
const generatePDF = () => {
    try {
    const doc = new jsPDF();

      // Header
    doc.setFontSize(10);
    doc.text('MTA GOPIC - Equipe B', 10, 10);
    doc.text('2 rue des voyelles, 93290 Tremblay-en-France', 10, 15);
    doc.text('RCS : Bobigny B 807 384 128 Bobigny', 10, 20);
    doc.text('Tél : 01 84 80 53 31', 160, 10);
    doc.text('Email : compta@mtacolis.com', 160, 15);

    doc.setFontSize(14);
    doc.text("CONFIRMATION D'AFFRETEMENT", 70, 30);

    doc.setFontSize(10);
    doc.text(`Le ${data.createdAt}`, 10, 38);

      // Voyage / Client
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Voyage N° ${data.orderId}`, 10, 48);
    doc.text('Référence à rappeler sur votre facture', 130, 48);

      // Première table - Position de départ fixe
    const firstTableStartY = 55;
    autoTable(doc, {
        startY: firstTableStartY,
        head: [["A l'attention de", '', 'Tél']],
        body: [[
        `${data.sender.name}, ${data.sender.address}`,
        '',
        data.sender.phone
        ]],
        theme: 'grid',
        styles: { fontSize: 9 },
    });

      // Tables suivantes - Vérification de l'existence de previous
    let lastY = firstTableStartY;
    if (doc.lastAutoTable) {
        lastY = doc.lastAutoTable.finalY + 5;
    }

    autoTable(doc, {
    startY: lastY,
        head: [['Marchandises', '', 'Prix convenu HT']],
        body: [[
        `${data.nature} / ${data.transportMode}`,
        '',
        `${data.agreedPrice.toLocaleString()} FCFA`
        ]],
        theme: 'grid',
        styles: { fontSize: 9 },
    });

      // Mise à jour de lastY pour la table suivante
    if (doc.lastAutoTable) {
        lastY = doc.lastAutoTable.finalY + 5;
    }

    autoTable(doc, {
        startY: lastY,
        head: [['Ordre de transport']],
        body: [
        [`Chargement : ${data.loadingDate} - ${data.loadingHour}`,
        `Lieu : ${data.route.from}`,
        `Marchandise : ${data.nature} / ${data.transportMode}`,
        `Quantité : ${data.volume || 'NC'} mpl`,
        `Poids : ${data.weight} kg`,
        `Spécificités : palette ? Non`],
        [`Livraison : ${data.deliveryDate} - ${data.deliveryHour}`,
        `Lieu : ${data.route.to}`],
        ].flat().map(line => [line]),
        theme: 'grid',
        styles: { fontSize: 9 },
    });

      // Footer
    doc.setFontSize(9);
    doc.text('Adresse de facturation : MTA GOPIC - 2 rue des voyelles - 93290 Tremblay-en-France', 
            10, doc.internal.pageSize.height - 25);
    doc.text('Merci de renvoyer ce bon pour accord.', 
            10, doc.internal.pageSize.height - 20);

    doc.save(`OT_${data.orderId}.pdf`);
    } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    alert("Une erreur est survenue lors de la génération du PDF.");
    }
};

return (
    <button
    onClick={generatePDF}
    className="mt-6 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
    <Download size={16} /> Télécharger l'OT (PDF)
    </button>
);
}