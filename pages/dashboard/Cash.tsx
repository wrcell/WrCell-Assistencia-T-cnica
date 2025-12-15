import React, { useState } from 'react';
import { MOCK_CASH_REGISTERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  X,
  CheckCircle2,
  Calendar,
  Wallet
} from 'lucide-react';

export const Cash: React.FC = () => {
  // State to simulate Box Status
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [registerData, setRegisterData] = useState(MOCK_CASH_REGISTERS[0]);
  
  // Modals
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  
  // Input for opening balance
  const [openingBalanceInput, setOpeningBalanceInput] = useState('');

  // Handlers
  const handleOpenBox = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(openingBalanceInput.replace(',', '.'));
    
    if (isNaN(balance)) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    setRegisterData({
        ...registerData,
        openingBalance: balance,
        entries: 0,
        exits: 0,
        closingBalance: balance, // Starts equal to opening
        openingDate: new Date().toISOString(),
        closingDate: ''
    });
    
    setIsBoxOpen(true);
    setShowOpenModal(false);
    setOpeningBalanceInput('');
  };

  const handleCloseBox = () => {
    setRegisterData({
        ...registerData,
        closingDate: new Date().toISOString()
    });
    setIsBoxOpen(false);
    setShowCloseModal(false);
  };

  // Calculations
  const currentBalance = registerData.openingBalance + registerData.entries - registerData.exits;

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 font-heading">Fluxo de Caixa</h1>
           <p className="text-sm text-gray-500 mt-1">Gerencie as entradas, saídas e fechamento diário.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm ${isBoxOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isBoxOpen ? <Unlock size={16} /> : <Lock size={16} />}
                {isBoxOpen ? 'CAIXA ABERTO' : 'CAIXA FECHADO'}
            </div>
            
            {!isBoxOpen ? (
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowOpenModal(true)}>
                    Abrir Caixa
                </Button>
            ) : (
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowCloseModal(true)}>
                    Fechar Caixa
                </Button>
            )}
        </div>
      </div>
      
      {/* Empty State / Closed Box Overlay */}
      {!isBoxOpen ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center shadow-sm h-[400px]">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <Lock size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">O Caixa está Fechado</h2>
              <p className="text-gray-500 max-w-md mb-8">
                  Para realizar vendas, lançar despesas ou movimentar valores, é necessário realizar a abertura do caixa informando o saldo inicial.
              </p>
              <Button size="lg" className="bg-[#0B0F19] px-8" onClick={() => setShowOpenModal(true)}>
                  Realizar Abertura
              </Button>
          </div>
      ) : (
          /* Active Dashboard */
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                {/* Saldo Inicial */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet size={40} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-500 font-heading">Saldo Inicial</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">R$ {registerData.openingBalance.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">Iniciado às {new Date(registerData.openingDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>

                {/* Entradas */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-green-600">
                        <ArrowUpCircle size={40} />
                    </div>
                    <h3 className="text-sm font-bold text-green-600 flex items-center gap-2 font-heading">
                        Entradas
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">+ R$ {registerData.entries.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">Vendas e Recebimentos</p>
                </div>

                {/* Saídas */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-red-600">
                        <ArrowDownCircle size={40} />
                    </div>
                    <h3 className="text-sm font-bold text-red-600 flex items-center gap-2 font-heading">
                        Saídas
                    </h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">- R$ {registerData.exits.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">Despesas e Sangrias</p>
                </div>

                {/* Saldo Atual */}
                <div className="bg-[#0B0F19] p-6 rounded-xl border border-gray-900 shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <DollarSign size={40} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-300 font-heading">Saldo Atual em Caixa</h3>
                    <p className="text-3xl font-bold mt-2">R$ {currentBalance.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">Disponível para movimentação</p>
                </div>
            </div>

            {/* Recent Movements Placeholder - Can be expanded later */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 font-heading">Movimentações do Dia</h3>
                    <Button variant="outline" size="sm">Ver Extrato Completo</Button>
                </div>
                
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">Nenhuma movimentação recente registrada neste caixa.</p>
                </div>
            </div>
          </>
      )}

      {/* --- MODAL ABERTURA DE CAIXA --- */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative">
                <button 
                    onClick={() => setShowOpenModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center mb-6 text-center">
                        <div className="bg-green-100 p-3 rounded-full mb-4 text-green-600">
                            <Unlock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-heading">Abertura de Caixa</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>

                    <form onSubmit={handleOpenBox} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 font-heading">Saldo Inicial (Troco)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">R$</span>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0,00"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-lg font-bold text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={openingBalanceInput}
                                    onChange={(e) => setOpeningBalanceInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Informe o valor em dinheiro disponível na gaveta.</p>
                        </div>

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg">
                            Confirmar Abertura
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL FECHAMENTO DE CAIXA --- */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative">
                <button 
                    onClick={() => setShowCloseModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center mb-6 text-center">
                        <div className="bg-red-100 p-3 rounded-full mb-4 text-red-600">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-heading">Fechamento de Caixa</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Confira os valores antes de encerrar.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Saldo Inicial</span>
                            <span className="font-bold text-gray-900">R$ {registerData.openingBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Entradas</span>
                            <span className="font-bold text-green-600">+ R$ {registerData.entries.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Saídas</span>
                            <span className="font-bold text-red-600">- R$ {registerData.exits.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-gray-900 font-heading">Saldo Final Calculado</span>
                            <span className="text-xl font-bold text-[#0B0F19]">R$ {currentBalance.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-6">
                        <AlertTriangle className="text-yellow-600 flex-shrink-0" size={18} />
                        <p className="text-xs text-yellow-700">
                            Ao confirmar, o caixa será encerrado e não será possível realizar novas movimentações até a próxima abertura.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" onClick={() => setShowCloseModal(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCloseBox}>
                            Encerrar Caixa
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};