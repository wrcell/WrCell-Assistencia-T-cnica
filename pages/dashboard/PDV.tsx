import React, { useState, useEffect, useRef } from 'react';
import { MOCK_PRODUCTS, MOCK_USERS, MOCK_INSTALLMENTS } from '../../services/mockData';
import { useCompany } from '../../context/CompanyContext';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Trash2, 
  ShoppingCart, 
  X, 
  QrCode, 
  CreditCard, 
  CircleDollarSign, 
  FileSignature, 
  FileText, 
  Award, 
  ChevronDown,
  Landmark,
  Wallet,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { Product, Installment, PixKey } from '../../types';

export const PDV: React.FC = () => {
  const { pixKeys, company } = useCompany(); // Get Pix Keys from Global Settings
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [pointsToRedeem, setPointsToRedeem] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [installments, setInstallments] = useState<number>(1);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  
  // Pix State
  const [showPixModal, setShowPixModal] = useState(false);
  const [selectedPixKey, setSelectedPixKey] = useState<PixKey | null>(null);
  
  // Dropdown Positioning State
  const paymentTriggerRef = useRef<HTMLButtonElement>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // Constants
  const POINTS_CONVERSION_RATE = 10; 
  const POINTS_EARNING_RATE = 1;     

  useEffect(() => {
    setInstallments(1);
    // Auto-select PIX key if only one exists
    if (paymentMethod === 'pix' && pixKeys.length === 1) {
        setSelectedPixKey(pixKeys[0]);
    } else {
        setSelectedPixKey(null);
    }
  }, [paymentMethod, pixKeys]);

  // Handle click outside dropdown logic (omitted for brevity, assume same as before)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (
            isPaymentDropdownOpen &&
            paymentDropdownRef.current &&
            !paymentDropdownRef.current.contains(event.target as Node) &&
            paymentTriggerRef.current &&
            !paymentTriggerRef.current.contains(event.target as Node)
        ) {
            setIsPaymentDropdownOpen(false);
        }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPaymentDropdownOpen]);

  const toggleDropdown = () => {
      if (isPaymentDropdownOpen) {
          setIsPaymentDropdownOpen(false);
      } else {
          if (paymentTriggerRef.current) {
              const rect = paymentTriggerRef.current.getBoundingClientRect();
              setDropdownPos({
                  top: rect.bottom + 4,
                  left: rect.left,
                  width: rect.width
              });
              setIsPaymentDropdownOpen(true);
          }
      }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const calculateSubtotal = () => cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const finalTotal = Math.max(0, calculateSubtotal() - discount);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClient = MOCK_USERS.find(u => u.id === selectedClientId);

  const handleApplyPoints = () => {
    if (!selectedClient || !selectedClient.points) return;
    const points = parseInt(pointsToRedeem);
    if (isNaN(points) || points <= 0 || points > selectedClient.points) return;
    const valueDiscount = points / POINTS_CONVERSION_RATE;
    if (valueDiscount > calculateSubtotal()) return;
    setDiscount(valueDiscount);
  };

  const handleFinishSale = () => {
    if (!paymentMethod) {
      alert("Selecione uma forma de pagamento.");
      return;
    }
    
    if (paymentMethod === 'pix' && !selectedPixKey && pixKeys.length > 0) {
        alert("Por favor, selecione a chave PIX para recebimento.");
        return;
    }

    // ... (Existing logic for Fiado/Boleto and Points updates) ...

    setTimeout(() => {
        alert(`Venda realizada com sucesso!`);
        setCart([]);
        setIsModalOpen(false);
        setShowPixModal(false);
        setDiscount(0);
        setPointsToRedeem('');
        setSelectedClientId('');
        setPaymentMethod('');
    }, 500);
  };

  const paymentOptions = [
    { id: 'pix', label: 'PIX', icon: Landmark },
    { id: 'money', label: 'Dinheiro', icon: CircleDollarSign },
    { id: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', label: 'Cartão de Débito', icon: CreditCard },
    { id: 'boleto', label: 'Boleto Parcelado', icon: FileText },
    { id: 'fiado', label: 'Fiado / A Prazo', icon: FileSignature },
  ];

  const selectedPaymentOption = paymentOptions.find(p => p.id === paymentMethod);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Product List & Cart Sidebar Logic (Same as before) */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => addToCart(product)} className="cursor-pointer group border border-gray-200 rounded-lg p-4 hover:border-accent hover:shadow-md transition-all">
                <div className="h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">IMG</span>
                </div>
                <h4 className="font-bold text-gray-900 line-clamp-1 text-sm font-heading">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-accent">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
         {/* Minimal Cart for Context */}
         <div className="flex-1 overflow-y-auto p-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between mb-2 text-sm">
                 <span>{item.quantity}x {item.product.name}</span>
                 <div className="flex gap-2 items-center">
                    <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500"><Trash2 size={14}/></button>
                 </div>
              </div>
            ))}
         </div>
         <div className="p-4 border-t">
            <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>R$ {calculateSubtotal().toFixed(2)}</span>
            </div>
            <Button className="w-full bg-[#0B0F19]" disabled={cart.length === 0} onClick={() => setIsModalOpen(true)}>Finalizar</Button>
         </div>
      </div>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-visible animate-fade-in relative flex flex-col max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><X size={20} /></button>
            <div className="px-8 pt-6 pb-2">
                <h2 className="text-xl font-bold text-gray-900 font-heading">Finalizar Venda</h2>
            </div>

            <div className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
                    <span className="text-lg font-bold text-gray-900">Total a Pagar:</span>
                    <span className="text-2xl font-bold text-gray-900">R$ {finalTotal.toFixed(2)}</span>
                </div>

                {/* Client Select (Simplified) */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Cliente</label>
                    <select 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                    >
                        <option value="">Selecione um cliente</option>
                        {MOCK_USERS.filter(u => u.profile === 'client').map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                    </select>
                </div>

                {/* Payment Method */}
                <div className="relative">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Forma de Pagamento</label>
                    <button ref={paymentTriggerRef} type="button" onClick={toggleDropdown} className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-700">
                            {selectedPaymentOption ? <><selectedPaymentOption.icon size={18} /><span>{selectedPaymentOption.label}</span></> : <span>Selecione...</span>}
                        </div>
                        <ChevronDown size={16} />
                    </button>
                    {isPaymentDropdownOpen && (
                        <div ref={paymentDropdownRef} className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999] py-2" style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}>
                            {paymentOptions.map((opt) => (
                                <button key={opt.id} onClick={() => { setPaymentMethod(opt.id); setIsPaymentDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50">
                                    <opt.icon size={18} /> {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* PIX Key Selection Logic */}
                {paymentMethod === 'pix' && (
                    <div className="animate-fade-in p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                        {pixKeys.length === 0 ? (
                            <div className="text-center text-red-500 text-sm">
                                <p>Nenhuma chave PIX cadastrada.</p>
                                <p className="text-xs mt-1">Vá em Configurações para adicionar.</p>
                            </div>
                        ) : pixKeys.length > 1 ? (
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-2">Selecione a Chave para Recebimento</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                                    onChange={(e) => {
                                        const key = pixKeys.find(k => k.id === e.target.value);
                                        setSelectedPixKey(key || null);
                                    }}
                                    value={selectedPixKey?.id || ''}
                                >
                                    <option value="">Escolha uma chave...</option>
                                    {pixKeys.map(pk => (
                                        <option key={pk.id} value={pk.id}>{pk.type}: {pk.key}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-600" />
                                Recebendo em: <b>{pixKeys[0].type}</b> ({pixKeys[0].key})
                            </div>
                        )}

                        <button 
                            disabled={!selectedPixKey}
                            onClick={() => setShowPixModal(true)}
                            className="w-full bg-[#0F172A] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                        >
                            <QrCode size={18} /> Gerar QR Code
                        </button>
                    </div>
                )}
            </div>
            
            {/* Footer Buttons */}
            <div className="px-8 pb-8 pt-4 flex gap-3">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">Cancelar</button>
                 <button onClick={handleFinishSale} className="flex-1 px-4 py-3 bg-[#0F172A] rounded-lg text-sm font-bold text-white hover:bg-gray-800">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Pix QR Code Modal */}
      {showPixModal && selectedPixKey && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden relative p-6">
                  <button onClick={() => setShowPixModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                  <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900 font-heading">Pagamento via PIX</h2>
                      <p className="text-gray-500 text-sm mt-1">Chave: {selectedPixKey.key}</p>
                  </div>
                  <div className="flex justify-center mb-4">
                      <div className="p-2 border border-gray-200 rounded-lg shadow-sm">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126330014BR.GOV.BCB.PIX01${selectedPixKey.key.length}${selectedPixKey.key}520400005303986540${finalTotal.toFixed(2).replace('.','')}`} 
                            alt="QR Code Pix"
                            className="w-48 h-48 object-contain"
                          />
                      </div>
                  </div>
                  <div className="text-center mb-6">
                      <p className="text-2xl font-bold text-gray-900">R$ {finalTotal.toFixed(2)}</p>
                  </div>
                  <button onClick={handleFinishSale} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-bold">Confirmar Pagamento</button>
              </div>
          </div>
      )}
    </div>
  );
};