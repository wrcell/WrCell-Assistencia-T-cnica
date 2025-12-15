import React, { useState } from 'react';
import { MOCK_ORDERS, MOCK_USERS, MOCK_COMPANY } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  Printer, 
  Search, 
  Plus, 
  Download, 
  Mail, 
  MessageCircle, 
  ScrollText, 
  Receipt, 
  FileCheck,
  CheckCircle2,
  AlertCircle,
  X,
  QrCode
} from 'lucide-react';
import { ServiceOrder } from '../../types';

type InvoiceType = 'nfe' | 'manual' | 'cupom' | 'recibo';

interface Invoice {
  id: string;
  type: InvoiceType;
  orderId: string;
  clientName: string;
  amount: number;
  issueDate: string;
  status: 'Emitida' | 'Cancelada' | 'Processando';
  xmlKey?: string; // Para NFe/NFCe
  number: number;
}

// Mock Data for "Sales Pending Invoice"
// In a real app, this would filter orders where invoice_id is null
const PENDING_SALES = MOCK_ORDERS.filter(o => o.status === 'Concluído').map(o => ({
    ...o,
    totalValue: 150.00 // Mock value since original MOCK_ORDERS doesn't have it calculated stored
}));

const MOCK_INVOICES: Invoice[] = [
    {
        id: '1',
        type: 'nfe',
        orderId: 'OS-001',
        clientName: 'W7matrix01 Reis',
        amount: 250.00,
        issueDate: '2025-11-10T14:30:00',
        status: 'Emitida',
        xmlKey: '35231100000000000191550010000000011000000001',
        number: 101
    },
    {
        id: '2',
        type: 'cupom',
        orderId: 'PDV-992',
        clientName: 'Consumidor Final',
        amount: 45.00,
        issueDate: '2025-11-11T09:15:00',
        status: 'Emitida',
        xmlKey: '35231100000000000191650010000000051000000005',
        number: 505
    }
];

export const NFe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InvoiceType>('nfe');
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Helpers
  const getTabLabel = (type: InvoiceType) => {
      switch(type) {
          case 'nfe': return 'Nota Fiscal Eletrônica (NF-e)';
          case 'manual': return 'Nota Fiscal Manual (Talão)';
          case 'cupom': return 'Cupom Fiscal (NFC-e/SAT)';
          case 'recibo': return 'Documento Não Fiscal (Recibo)';
      }
  };

  const filteredInvoices = invoices.filter(inv => 
      inv.type === activeTab && 
      (inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       inv.number.toString().includes(searchTerm))
  );

  const handleGenerateInvoice = (order: ServiceOrder) => {
      const newInvoice: Invoice = {
          id: String(Date.now()),
          type: activeTab,
          orderId: order.id,
          clientName: MOCK_USERS.find(u => u.id === order.clientId)?.firstName || 'Cliente',
          amount: 150.00, // Mock fixed value
          issueDate: new Date().toISOString(),
          status: 'Emitida',
          xmlKey: activeTab === 'nfe' || activeTab === 'cupom' ? Array(44).fill(0).map(() => Math.floor(Math.random() * 10)).join('') : undefined,
          number: Math.floor(Math.random() * 1000)
      };

      setInvoices([newInvoice, ...invoices]);
      setSelectedInvoice(newInvoice);
      setIsModalOpen(false);
  };

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '', 'width=900,height=800');
    if (!printWindow) return;
    
    // Styles vary by type
    const isThermal = invoice.type === 'cupom';
    
    const thermalStyles = `
        body { font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 10px; text-transform: uppercase; font-size: 12px; }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
        .qrcode { margin: 20px auto; width: 150px; height: 150px; background: #eee; display: flex; align-items: center; justify-content: center; }
    `;

    const a4Styles = `
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
        .danfe-border { border: 1px solid #000; padding: 5px; }
        .row { display: flex; width: 100%; }
        .col { border: 1px solid #000; padding: 5px; margin: -1px; }
        .label { font-size: 9px; font-weight: bold; display: block; }
        .value { font-size: 12px; }
        .header { font-weight: bold; font-size: 14px; text-align: center; background: #f0f0f0; }
        .barcode { height: 40px; background: #000; width: 300px; margin: 10px 0; }
    `;

    const htmlContent = `
        <html>
            <head>
                <title>${invoice.type.toUpperCase()} - ${invoice.number}</title>
                <style>${isThermal ? thermalStyles : a4Styles}</style>
            </head>
            <body>
                ${renderPrintTemplate(invoice)}
                <script>window.onload = function() { window.print(); }</script>
            </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const renderPrintTemplate = (invoice: Invoice) => {
      const company = MOCK_COMPANY;
      const date = new Date(invoice.issueDate).toLocaleDateString('pt-BR');
      
      if (invoice.type === 'cupom') {
          return `
            <div class="center">
                <div class="bold">${company.socialName}</div>
                <div>CNPJ: ${company.cnpj}</div>
                <div>${date} - Hora: ${new Date(invoice.issueDate).toLocaleTimeString('pt-BR')}</div>
                <div class="divider"></div>
                <div class="bold">EXTRATO No. ${invoice.number}</div>
                <div class="bold">CUPOM FISCAL ELETRÔNICO - SAT</div>
                <div class="divider"></div>
            </div>
            <div class="row"><span class="bold">ITEM CÓD DESCRIÇÃO</span></div>
            <div class="row"><span>001 123 SERVICO DE REPARO</span></div>
            <div class="row"><span>1 UN x ${invoice.amount.toFixed(2)}</span> <span>${invoice.amount.toFixed(2)}</span></div>
            <div class="divider"></div>
            <div class="row bold"><span>TOTAL R$</span> <span>${invoice.amount.toFixed(2)}</span></div>
            <div class="row"><span>Dinheiro</span> <span>${invoice.amount.toFixed(2)}</span></div>
            <div class="divider"></div>
            <div class="center">
                <div>OBSERVAÇÕES DO CONTRIBUINTE</div>
                <div>OS: ${invoice.orderId}</div>
                <div class="qrcode">QR CODE</div>
                <div>Chave de Acesso:</div>
                <div style="word-break: break-all; font-size: 10px;">${invoice.xmlKey}</div>
            </div>
          `;
      } 
      
      if (invoice.type === 'recibo') {
          return `
            <div style="border: 2px solid #000; padding: 40px; font-family: 'Times New Roman', serif;">
                <h1 style="text-align: center; text-decoration: underline;">RECIBO DE PAGAMENTO</h1>
                <h3 style="text-align: right; margin-bottom: 50px;">R$ ${invoice.amount.toFixed(2)}</h3>
                
                <p style="font-size: 18px; line-height: 1.6;">
                    Recebemos de <strong>${invoice.clientName}</strong> a importância de 
                    <strong>${invoice.amount.toFixed(2)} reais</strong>, referente aos serviços prestados 
                    na Ordem de Serviço <strong>${invoice.orderId}</strong>.
                </p>
                
                <p style="font-size: 18px; line-height: 1.6;">
                    Para maior clareza firmamos o presente.
                </p>
                
                <div style="margin-top: 60px; text-align: center;">
                    <p>Brasília, ${date}</p>
                    <br/><br/>
                    <div style="border-top: 1px solid #000; width: 60%; margin: 0 auto;"></div>
                    <p><strong>${company.name}</strong></p>
                    <p>${company.cnpj}</p>
                </div>
            </div>
          `;
      }

      // Default NFe / Manual (DANFE Style)
      return `
        <div class="danfe-border">
            <div class="row">
                <div class="col" style="flex: 2">
                    <span class="label">RECEBEMOS DE ${company.socialName} OS PRODUTOS/SERVIÇOS CONSTANTES NA NOTA FISCAL INDICADA AO LADO</span>
                    <div style="margin-top: 10px">DATA DE RECEBIMENTO: _____/_____/_______ &nbsp;&nbsp; ASSINATURA: ____________________</div>
                </div>
                <div class="col" style="flex: 1; text-align: center;">
                    <span class="bold" style="font-size: 18px;">NF-e</span>
                    <br/>
                    <span class="bold" style="font-size: 14px;">Nº ${invoice.number}</span>
                    <br/>
                    <span class="label">SÉRIE 1</span>
                </div>
            </div>
            <div style="height: 10px;"></div>
            <div class="row">
                <div class="col" style="flex: 1">
                    <span class="bold" style="font-size: 16px;">${company.socialName}</span>
                    <br/>
                    <span class="value">Rua Exemplo, 123, Centro - Cidade/UF</span>
                    <br/>
                    <span class="value">CNPJ: ${company.cnpj}</span>
                </div>
                <div class="col" style="flex: 1">
                    <span class="bold" style="font-size: 18px;">DANFE</span>
                    <span class="label">DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA</span>
                    <div class="row" style="margin-top: 5px;">
                        <div style="margin-right: 10px;">0 - Entrada<br/>1 - Saída</div>
                        <div style="border: 1px solid #000; padding: 5px; font-weight: bold; font-size: 16px;">1</div>
                    </div>
                    <span class="label" style="margin-top: 5px;">CHAVE DE ACESSO</span>
                    <div class="value">${invoice.xmlKey || '0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000'}</div>
                </div>
            </div>
            <div class="row">
                 <div class="col" style="flex: 1"><span class="label">NATUREZA DA OPERAÇÃO</span><span class="value">Prestação de Serviço / Venda</span></div>
                 <div class="col" style="flex: 1"><span class="label">PROTOCOLO DE AUTORIZAÇÃO DE USO</span><span class="value">123456789012345 - ${date}</span></div>
            </div>
            
            <div class="header" style="margin-top: 10px;">DESTINATÁRIO / REMETENTE</div>
            <div class="row">
                 <div class="col" style="flex: 3"><span class="label">NOME / RAZÃO SOCIAL</span><span class="value">${invoice.clientName}</span></div>
                 <div class="col" style="flex: 1"><span class="label">CPF/CNPJ</span><span class="value">000.000.000-00</span></div>
                 <div class="col" style="flex: 1"><span class="label">DATA EMISSÃO</span><span class="value">${date}</span></div>
            </div>
             <div class="header" style="margin-top: 10px;">CÁLCULO DO IMPOSTO</div>
             <div class="row">
                 <div class="col" style="flex: 1"><span class="label">VALOR TOTAL DOS PRODUTOS</span><span class="value">R$ ${invoice.amount.toFixed(2)}</span></div>
                 <div class="col" style="flex: 1"><span class="label">VALOR TOTAL DA NOTA</span><span class="value">R$ ${invoice.amount.toFixed(2)}</span></div>
            </div>
             <div class="header" style="margin-top: 10px;">DADOS DO PRODUTO / SERVIÇO</div>
             <div style="border: 1px solid #000; padding: 10px; min-height: 100px;">
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #000;">
                            <th align="left">CÓD</th>
                            <th align="left">DESCRIÇÃO</th>
                            <th align="center">QTD</th>
                            <th align="center">UN</th>
                            <th align="right">V. UNIT</th>
                            <th align="right">V. TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>001</td>
                            <td>SERVIÇOS REFERENTES A OS ${invoice.orderId}</td>
                            <td align="center">1</td>
                            <td align="center">UN</td>
                            <td align="right">${invoice.amount.toFixed(2)}</td>
                            <td align="right">${invoice.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
             </div>
        </div>
      `;
  }

  const handleShare = (method: 'whatsapp' | 'email', invoice: Invoice) => {
      const msg = `Olá ${invoice.clientName}, segue o link da sua ${getTabLabel(invoice.type)} no valor de R$ ${invoice.amount.toFixed(2)}.`;
      
      if (method === 'whatsapp') {
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
          window.open(`mailto:?subject=Nota Fiscal ${invoice.number}&body=${encodeURIComponent(msg)}`, '_blank');
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Notas Fiscais</h1>
          <p className="text-sm text-gray-500 mt-1">Emissão, gerenciamento e envio de documentos fiscais.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Nova Nota / Recibo
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
        {(['nfe', 'manual', 'cupom', 'recibo'] as InvoiceType[]).map((tab) => (
            <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedInvoice(null); }}
                className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors border-b-2 
                    ${activeTab === tab 
                        ? 'border-accent text-accent' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
                {getTabLabel(tab)}
            </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left List */}
        <div className="w-full lg:w-4/12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar por cliente ou número..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredInvoices.map(inv => (
                <div 
                  key={inv.id} 
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedInvoice?.id === inv.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                       {inv.type === 'cupom' ? <ScrollText size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{inv.clientName}</p>
                      <p className="text-xs text-gray-500">Nº {inv.number} • {new Date(inv.issueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">R$ {inv.amount.toFixed(2)}</p>
                       <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-green-100 text-green-700 border border-green-200">
                         {inv.status}
                       </span>
                  </div>
                </div>
              ))}
              {filteredInvoices.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                   <AlertCircle size={32} className="mb-2 opacity-50" />
                   Nenhum documento encontrado nesta categoria.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden bg-gray-50/50">
          {selectedInvoice ? (
            <div className="h-full flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
                 <div>
                    <h2 className="text-lg font-bold text-gray-900 font-heading">
                        {activeTab === 'cupom' ? `Extrato ${selectedInvoice.number}` : `Nota Fiscal ${selectedInvoice.number}`}
                    </h2>
                    <p className="text-xs text-gray-500">Ref: {selectedInvoice.orderId}</p>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleShare('whatsapp', selectedInvoice)}>
                        <MessageCircle size={16} className="mr-2 text-green-600" /> WhatsApp
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleShare('email', selectedInvoice)}>
                        <Mail size={16} className="mr-2" /> Email
                    </Button>
                    <Button className="bg-[#0B0F19]" size="sm" onClick={() => handlePrint(selectedInvoice)}>
                        <Printer size={16} className="mr-2" /> Imprimir / PDF
                    </Button>
                 </div>
              </div>

              {/* Document Preview Area */}
              <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                 {/* 
                    This is a visual CSS-only representation of the document for the dashboard.
                    The actual print logic uses the renderPrintTemplate function.
                 */}
                 <div className={`bg-white shadow-lg text-xs leading-relaxed text-gray-800 transition-all duration-300
                    ${activeTab === 'cupom' ? 'w-[300px] p-4 min-h-[400px]' : 'w-[210mm] min-h-[297mm] p-[15mm]'}`}>
                    
                    {/* Visual Preview Content based on Type */}
                    {activeTab === 'cupom' ? (
                        <div className="text-center font-mono uppercase">
                             <div className="font-bold border-b border-dashed border-gray-300 pb-2 mb-2">
                                 {MOCK_COMPANY.socialName}<br/>
                                 CNPJ: {MOCK_COMPANY.cnpj}
                             </div>
                             <div className="font-bold text-sm mb-2">Extrato No. {selectedInvoice.number}</div>
                             <div className="text-left border-b border-dashed border-gray-300 pb-2 mb-2">
                                 <div className="flex justify-between font-bold"><span>ITEM</span> <span>VALOR</span></div>
                                 <div className="flex justify-between"><span>1. SERVIÇOS</span> <span>{selectedInvoice.amount.toFixed(2)}</span></div>
                             </div>
                             <div className="flex justify-between font-bold text-lg">
                                 <span>TOTAL</span>
                                 <span>R$ {selectedInvoice.amount.toFixed(2)}</span>
                             </div>
                             <div className="mt-8 flex justify-center">
                                 <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                                     <QrCode size={40} className="opacity-50" />
                                 </div>
                             </div>
                        </div>
                    ) : (
                        <div className="font-sans">
                            <div className="border border-gray-300 p-4 mb-4 flex justify-between items-start">
                                 <div>
                                     <h1 className="text-xl font-bold">{MOCK_COMPANY.socialName}</h1>
                                     <p>{MOCK_COMPANY.cnpj}</p>
                                     <p className="mt-2 text-sm text-gray-500">Natureza da Operação: Prestação de Serviços</p>
                                 </div>
                                 <div className="text-right">
                                     <h2 className="text-2xl font-bold text-gray-400">{selectedInvoice.type === 'recibo' ? 'RECIBO' : 'DANFE'}</h2>
                                     <p className="font-bold text-lg">Nº {selectedInvoice.number}</p>
                                 </div>
                            </div>
                            
                            <div className="border border-gray-300 p-2 mb-4 bg-gray-50">
                                <span className="text-[10px] font-bold text-gray-500 block">DESTINATÁRIO</span>
                                <div className="font-bold text-sm">{selectedInvoice.clientName}</div>
                            </div>

                            <table className="w-full border-collapse border border-gray-300 mb-6">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-left">Descrição</th>
                                        <th className="border p-2 text-center">Qtd</th>
                                        <th className="border p-2 text-right">Unitário</th>
                                        <th className="border p-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">Serviços ref. OS {selectedInvoice.orderId}</td>
                                        <td className="border p-2 text-center">1</td>
                                        <td className="border p-2 text-right">{selectedInvoice.amount.toFixed(2)}</td>
                                        <td className="border p-2 text-right">{selectedInvoice.amount.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex justify-end">
                                <div className="w-1/3 border border-gray-300 p-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>TOTAL</span>
                                        <span>R$ {selectedInvoice.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <FileCheck size={48} className="mb-4 opacity-20" />
                <p>Selecione um documento para visualizar</p>
             </div>
          )}
        </div>
      </div>

      {/* Select Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                <X size={20} />
            </button>
            
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-heading">Gerar {getTabLabel(activeTab)}</h2>
              <p className="text-sm text-gray-500 mt-1">Selecione uma venda ou serviço concluído para emitir o documento.</p>
            </div>

            <div className="p-8">
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar venda..." 
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-gray-50"
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 font-heading text-gray-500 sticky top-0">
                            <tr>
                                <th className="p-3">Ref</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Data</th>
                                <th className="p-3 text-right">Valor</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {PENDING_SALES.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-900">{sale.id}</td>
                                    <td className="p-3 text-gray-600">{MOCK_USERS.find(u => u.id === sale.clientId)?.firstName}</td>
                                    <td className="p-3 text-gray-500">{new Date(sale.entryDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-3 text-right font-bold text-gray-900">R$ 150,00</td>
                                    <td className="p-3 text-right">
                                        <Button size="sm" onClick={() => handleGenerateInvoice(sale)}>
                                            Gerar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {PENDING_SALES.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            Nenhuma venda pendente de emissão encontrada.
                        </div>
                    )}
                </div>
            </div>
            
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>* Apenas vendas com status 'Concluído' aparecem aqui.</span>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};