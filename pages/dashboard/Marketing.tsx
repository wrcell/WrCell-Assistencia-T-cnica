import React, { useState } from 'react';
import { MOCK_USERS, MOCK_PRODUCTS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  MessageCircle, 
  Send, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  Calendar, 
  Users, 
  Star,
  Gift,
  LayoutTemplate,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

type Tab = 'campaigns' | 'studio' | 'reviews';

export const Marketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('campaigns');

  return (
    <div className="flex flex-col space-y-6 font-sans pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <Share2 className="text-gray-900" size={24} />
          Marketing & CRM
        </h1>
        <p className="text-sm text-gray-500 mt-1">Ferramentas para atrair e fidelizar clientes.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'campaigns' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Campanhas WhatsApp
        </button>
        <button
          onClick={() => setActiveTab('studio')}
          className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'studio' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Estúdio Criativo
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Gestão de Avaliações
        </button>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'campaigns' && <CampaignsTab />}
        {activeTab === 'studio' && <CreativeStudioTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CampaignsTab: React.FC = () => {
  const [segment, setSegment] = useState('inactive');
  const [message, setMessage] = useState('');

  // Mock calculation of audience size
  const getAudienceSize = () => {
    switch (segment) {
      case 'inactive': return 12;
      case 'birthdays': return 3;
      case 'all': return MOCK_USERS.filter(u => u.profile === 'client').length;
      default: return 0;
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSegment(val);
    switch (val) {
      case 'inactive':
        setMessage("Olá! 👋 Faz tempo que não vemos você por aqui. Estamos com uma promoção especial em películas e acessórios essa semana. Venha conferir!");
        break;
      case 'birthdays':
        setMessage("Parabéns! 🎉 Hoje é seu dia e a WrCell quer te presentear. Passe aqui e ganhe 15% de desconto em qualquer serviço.");
        break;
      case 'all':
        setMessage("Novidade na área! 🚀 Chegaram novos acessórios para iPhone e Samsung. Venha garantir o seu antes que acabe!");
        break;
    }
  };

  // Set initial message
  React.useEffect(() => {
    handleTemplateChange({ target: { value: 'inactive' } } as any);
  }, []);

  const handleSend = () => {
    alert(`Simulação: Disparando mensagens para ${getAudienceSize()} contatos via API WhatsApp...`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-heading mb-2">Configurar Disparo</h3>
          <p className="text-sm text-gray-500 mb-4">Envie mensagens em massa para segmentar seus clientes.</p>
          
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Público Alvo</label>
          <select 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-accent"
            value={segment}
            onChange={handleTemplateChange}
          >
            <option value="inactive">Clientes Inativos (+90 dias)</option>
            <option value="birthdays">Aniversariantes do Mês</option>
            <option value="all">Todos os Clientes (Base Completa)</option>
          </select>
          
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            <Users size={16} />
            <span className="font-bold">{getAudienceSize()} clientes</span> selecionados para este envio.
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Mensagem</label>
          <textarea 
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">Dica: Use emojis para aumentar a taxa de resposta.</p>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={handleSend}>
          <Send size={18} /> Iniciar Disparo
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-[#E5DDD5] p-6 rounded-xl border border-gray-200 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
         <div className="absolute top-0 w-full h-12 bg-[#00A884] opacity-90 flex items-center px-4">
            <span className="text-white font-bold text-sm">WhatsApp Web</span>
         </div>
         
         <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] rounded-tl-none mt-8 self-start ml-4 relative">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{message}</p>
            <span className="text-[10px] text-gray-400 block text-right mt-1">10:42</span>
            {/* Triangle for chat bubble */}
            <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
         </div>
      </div>
    </div>
  );
};

const CreativeStudioTab: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]?.id || '');
  const [customText, setCustomText] = useState('PROMOÇÃO');
  const [themeColor, setThemeColor] = useState('#000000'); // Default black

  const product = MOCK_PRODUCTS.find(p => p.id === selectedProduct);

  const downloadImage = () => {
    alert("Funcionalidade: A imagem gerada seria baixada como PNG de alta resolução pronta para o Instagram.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6 h-fit">
         <h3 className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
            <LayoutTemplate size={20} /> Editor
         </h3>

         <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Produto em Destaque</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white outline-none"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {MOCK_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
              ))}
            </select>
         </div>

         <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Texto de Chamada</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={20}
            />
         </div>

         <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Cor do Tema</label>
            <div className="flex gap-2">
               {['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
                 <button
                   key={color}
                   onClick={() => setThemeColor(color)}
                   className={`w-8 h-8 rounded-full border-2 ${themeColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
            </div>
         </div>

         <Button className="w-full bg-[#0B0F19]" onClick={downloadImage}>
            <Download size={18} className="mr-2" /> Baixar Imagem (PNG)
         </Button>
      </div>

      {/* Canvas / Preview */}
      <div className="lg:col-span-8 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-8 min-h-[500px]">
         {/* Simulate an Instagram Story Canvas (9:16 ratio usually, but square for feed here) */}
         <div 
            className="w-[400px] h-[400px] bg-white shadow-2xl relative flex flex-col overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: themeColor }}
         >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>

            {/* Header */}
            <div className="absolute top-8 left-0 w-full text-center z-10 px-4">
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-md font-heading break-words leading-none">
                  {customText}
               </h2>
               <div className="w-16 h-1 bg-white mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Product Image Area */}
            <div className="flex-1 flex items-center justify-center z-0 mt-10">
               <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/20">
                  <Smartphone size={80} className="text-gray-800" strokeWidth={1} />
               </div>
            </div>

            {/* Footer / Price */}
            <div className="bg-white/10 backdrop-blur-md p-6 text-center z-10 border-t border-white/10">
               <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-sm">{product?.name}</h3>
               <div className="inline-block bg-white text-black font-black text-2xl px-4 py-1 rounded-lg transform -rotate-2 shadow-lg mt-2">
                  R$ {product?.price.toFixed(2)}
               </div>
            </div>

            {/* Store Branding */}
            <div className="absolute top-4 left-4 text-white/50 text-xs font-bold uppercase tracking-widest">
               WrCell System
            </div>
         </div>
      </div>
    </div>
  );
};

const ReviewsTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
             <div className="flex justify-center mb-2 text-yellow-400 gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={24} />)}
             </div>
             <span className="text-3xl font-bold text-gray-900 block">4.8</span>
             <span className="text-sm text-gray-500">Média Geral</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col justify-center items-center">
             <MessageCircle size={32} className="text-blue-500 mb-2" />
             <span className="text-3xl font-bold text-gray-900 block">124</span>
             <span className="text-sm text-gray-500">Avaliações Totais</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col justify-center items-center">
             <Gift size={32} className="text-pink-500 mb-2" />
             <span className="text-3xl font-bold text-gray-900 block">15</span>
             <span className="text-sm text-gray-500">Cupons por Review</span>
          </div>
       </div>

       {/* Link Generator */}
       <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">Solicitar Avaliação</h2>
          <p className="text-gray-600 mb-6">Envie este link para seus clientes após o serviço. Clientes que avaliam voltam 3x mais.</p>
          
          <div className="flex gap-4">
             <input 
               readOnly 
               value="https://g.page/r/wrcell-reviews/review" 
               className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-600 outline-none"
             />
             <Button className="bg-[#0B0F19] text-white">
                Copiar Link
             </Button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
             <h3 className="font-bold text-gray-900 mb-4">Mensagem Sugerida</h3>
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 italic">
                "Olá! Obrigado pela preferência na WrCell. Poderia nos ajudar com uma avaliação rápida? Leva menos de 1 minuto: https://g.page/r/wrcell..."
             </div>
             <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1">
                   <MessageCircle size={16} className="mr-2" /> Enviar por WhatsApp
                </Button>
             </div>
          </div>
       </div>
    </div>
  );
};