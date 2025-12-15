import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCompany } from '../../context/CompanyContext';
import { Button } from '../../components/ui/Button';
import { 
  Building, 
  Palette, 
  Monitor, 
  Share2, 
  FileText, 
  Database, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Image, 
  Smartphone, 
  Mail, 
  Globe, 
  QrCode,
  Layout,
  Type,
  Video,
  Sliders,
  Play
} from 'lucide-react';

type Tab = 'general' | 'themes' | 'landing' | 'social' | 'fiscal' | 'backup';

export const Settings: React.FC = () => {
  const { accentColor, setAccentColor } = useTheme();
  const { 
    company, 
    updateCompany, 
    pixKeys, 
    addPixKey, 
    removePixKey, 
    bankAccounts, 
    addBankAccount, 
    removeBankAccount 
  } = useCompany();

  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Social Local State (sync to company.socialNetworks in real app)
  const [social, setSocial] = useState({
    instagram: '@wrcell',
    facebook: 'WrCell System',
    whatsapp: '5541999999999',
    email: 'contato@wrcell.com',
    website: 'https://wrcell.com.br'
  });

  // Fiscal Local State
  const [fiscal, setFiscal] = useState({
    cnpj: '00.000.000/0001-00',
    ie: 'Isento',
    crt: 'Simples Nacional',
    certPassword: ''
  });

  // --- HANDLERS ---

  const handleSave = () => {
    setIsSaving(true);
    // In a real app, this would push `company` state to backend.
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações salvas e aplicadas em todo o sistema!');
    }, 800);
  };

  const handleAddPix = () => {
    const type = prompt('Tipo de Chave (CPF, CNPJ, Email, Telefone, Aleatória):');
    if (!type) return;
    const key = prompt('Chave PIX:');
    if (!key) return;
    addPixKey({ id: Date.now().toString(), type, key });
  };

  const handleAddBank = () => {
    const bank = prompt('Nome do Banco:');
    if (!bank) return;
    const agency = prompt('Agência:');
    const account = prompt('Conta:');
    
    addBankAccount({ 
      id: Date.now().toString(), 
      bank, 
      agency: agency || '0000', 
      account: account || '00000-0', 
      holder: company.name 
    });
  };

  const updateLandingConfig = (field: string, value: any) => {
    if (!company.landingConfig) return;
    
    // Check if field is nested (e.g. featuredVideo.title)
    if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updateCompany({
            landingConfig: {
                ...company.landingConfig,
                [parent]: {
                    ...company.landingConfig[parent as keyof typeof company.landingConfig] as any,
                    [child]: value
                }
            }
        });
    } else {
        updateCompany({
            landingConfig: {
                ...company.landingConfig,
                [field]: value
            }
        });
    }
  };

  const addBanner = () => {
      if (!company.landingConfig) return;
      const newBanner = {
          id: Date.now().toString(),
          imageUrl: '',
          title: 'Novo Banner',
          subtitle: 'Descrição do banner'
      };
      updateLandingConfig('banners', [...company.landingConfig.banners, newBanner]);
  };

  const removeBanner = (id: string) => {
      if (!company.landingConfig) return;
      updateLandingConfig('banners', company.landingConfig.banners.filter(b => b.id !== id));
  };

  const updateBanner = (id: string, field: string, value: string) => {
      if (!company.landingConfig) return;
      const updatedBanners = company.landingConfig.banners.map(b => 
          b.id === id ? { ...b, [field]: value } : b
      );
      updateLandingConfig('banners', updatedBanners);
  };

  // --- SUB-COMPONENTS FOR TABS ---

  const GeneralTab = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Company Info */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
          <Building size={20} /> Informações da Empresa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome da Empresa</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              value={company.name}
              onChange={(e) => updateCompany({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Telefone / WhatsApp Principal</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              value={company.phone || ''}
              onChange={(e) => updateCompany({ phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Endereço Completo</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
              value={company.address || ''}
              onChange={(e) => updateCompany({ address: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Logomarca (para recibos, etc.)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400">
                <Image size={24} />
              </div>
              <Button variant="secondary" className="text-sm">
                <Upload size={16} className="mr-2" /> Enviar Logomarca
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Favicon (ícone do navegador)</label>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center border border-gray-200 text-gray-400">
                <Globe size={16} />
              </div>
              <Button variant="secondary" className="text-sm">
                <Upload size={16} className="mr-2" /> Enviar Favicon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PIX Keys */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
          <QrCode size={20} /> Chaves PIX
        </h2>
        <p className="text-sm text-gray-500 mb-4">Gerencie as chaves PIX que serão usadas para gerar QR Codes de pagamento.</p>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 font-bold text-gray-700">
              <tr>
                <th className="p-3">Tipo</th>
                <th className="p-3">Chave</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pixKeys.map(pk => (
                <tr key={pk.id}>
                  <td className="p-3">{pk.type}</td>
                  <td className="p-3 font-mono text-gray-600">{pk.key}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => removePixKey(pk.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {pixKeys.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center text-gray-400">Nenhuma chave cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddPix}>
          <Plus size={16} className="mr-2" /> Adicionar Chave PIX
        </Button>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
          <Building size={20} /> Contas Bancárias para Boleto
        </h2>
        <p className="text-sm text-gray-500 mb-4">Adicione contas bancárias que aparecerão como opção de pagamento no carnê de boletos.</p>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 font-bold text-gray-700">
              <tr>
                <th className="p-3">Banco</th>
                <th className="p-3">Ag/CC</th>
                <th className="p-3">Titular</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bankAccounts.map(bk => (
                <tr key={bk.id}>
                  <td className="p-3">{bk.bank}</td>
                  <td className="p-3 text-gray-600">{bk.agency} / {bk.account}</td>
                  <td className="p-3 text-gray-600">{bk.holder}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => removeBankAccount(bk.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {bankAccounts.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400">Nenhuma conta cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddBank}>
          <Plus size={16} className="mr-2" /> Adicionar Conta
        </Button>
      </div>
    </div>
  );

  const ThemesTab = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
          <Palette size={20} /> Personalização do Sistema
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 font-heading">Cor de Destaque (Sistema)</label>
            <div className="flex flex-wrap gap-4 items-center">
              {['#007BFF', '#28A745', '#DC3545', '#FD7E14', '#6610F2', '#E83E8C', '#20C997', '#111827'].map(color => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-10 h-10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 ${
                    accentColor.toLowerCase() === color.toLowerCase() 
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' 
                      : 'hover:scale-105 border border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="relative ml-2 group">
                 <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-400 group-hover:bg-gray-50 transition-colors">
                   <Plus size={16} />
                 </div>
                 <input 
                   type="color" 
                   value={accentColor}
                   onChange={(e) => setAccentColor(e.target.value)}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LandingPageTab = () => {
      const config = company.landingConfig || {
          heroTitle: '',
          heroSubtitle: '',
          heroVideoUrl: '',
          heroImageUrl: '',
          useCarousel: false,
          heroOverlayOpacity: 80,
          banners: [],
          featuredVideo: { title: '', description: '', videoUrl: '' },
          showFeatures: true,
          showPlans: true,
          showTestimonials: true
      };

      return (
        <div className="space-y-8 animate-fade-in">
          
          {/* Conteúdo do Topo (Hero) */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
               Conteúdo do Topo (Hero)
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Título Principal</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                        value={config.heroTitle}
                        onChange={(e) => updateLandingConfig('heroTitle', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Subtítulo</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                        value={config.heroSubtitle}
                        onChange={(e) => updateLandingConfig('heroSubtitle', e.target.value)}
                    />
                </div>
            </div>
          </div>

          {/* Mídia de Fundo */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
               Mídia de Fundo
            </h2>
            <p className="text-sm text-gray-500 mb-4">Escolha entre um vídeo, uma imagem ou um carrossel de banners.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">URL do Vídeo de Fundo (.mp4)</label>
                    <input 
                        type="text" 
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                        value={config.heroVideoUrl}
                        onChange={(e) => updateLandingConfig('heroVideoUrl', e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Ou Imagem de Fundo</label>
                    <div className="flex gap-2 items-center">
                        <div className="w-16 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                            {config.heroImageUrl ? <img src={config.heroImageUrl} className="w-full h-full object-cover" alt="bg" /> : <Image size={16} className="text-gray-400" />}
                        </div>
                        <Button variant="secondary" size="sm">
                            <Upload size={16} className="mr-2" /> Enviar Imagem
                        </Button>
                    </div>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            checked={config.useCarousel}
                            onChange={(e) => updateLandingConfig('useCarousel', e.target.checked)}
                        />
                        <span className="text-sm font-bold text-gray-900">Usar Carrossel de Banners como fundo</span>
                    </label>
                </div>
            </div>
          </div>

          {/* Gerenciador de Banners */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
               Gerenciador de Banners do Carrossel
            </h2>
            
            <div className="space-y-4">
                {config.banners.map((banner, index) => (
                    <div key={banner.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-start">
                        <div className="w-full md:w-48 flex-shrink-0">
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Imagem do Banner</label>
                            <div className="h-24 bg-white border border-gray-200 rounded flex items-center justify-center mb-2 overflow-hidden">
                                {banner.imageUrl ? <img src={banner.imageUrl} className="w-full h-full object-cover" alt="banner" /> : <Image size={20} className="text-gray-300" />}
                            </div>
                            <Button variant="secondary" size="sm" className="w-full text-xs">
                                <Upload size={12} className="mr-1" /> Enviar Imagem
                            </Button>
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Título do Banner</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm outline-none"
                                    value={banner.title}
                                    onChange={(e) => updateBanner(banner.id, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Subtítulo do Banner</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm outline-none"
                                    value={banner.subtitle}
                                    onChange={(e) => updateBanner(banner.id, 'subtitle', e.target.value)}
                                />
                            </div>
                        </div>
                        <button onClick={() => removeBanner(banner.id)} className="text-red-400 hover:text-red-600 p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                
                <Button variant="secondary" size="sm" onClick={addBanner}>
                    <Plus size={16} className="mr-2" /> Adicionar Banner
                </Button>
            </div>
          </div>

          {/* Seção de Vídeo em Destaque */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
               <Play size={20} /> Seção de Vídeo em Destaque
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Título da Seção</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                        value={config.featuredVideo.title}
                        onChange={(e) => updateLandingConfig('featuredVideo.title', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Texto da Seção</label>
                    <textarea 
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent resize-none"
                        value={config.featuredVideo.description}
                        onChange={(e) => updateLandingConfig('featuredVideo.description', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">URL do Vídeo (.mp4 ou YouTube Embed)</label>
                    <input 
                        type="text" 
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                        value={config.featuredVideo.videoUrl}
                        onChange={(e) => updateLandingConfig('featuredVideo.videoUrl', e.target.value)}
                    />
                </div>
            </div>
          </div>

        </div>
      );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Personalize o sistema de acordo com as necessidades do seu negócio.</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {[
          { id: 'general', label: 'Geral', icon: Building },
          { id: 'themes', label: 'Temas', icon: Palette },
          { id: 'landing', label: 'Landing Page', icon: Monitor },
          { id: 'social', label: 'Redes e Contato', icon: Share2 },
          { id: 'fiscal', label: 'Fiscal & NFe', icon: FileText },
          { id: 'backup', label: 'Backup', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-bold transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-gray-900 border border-gray-200 border-b-white shadow-sm translate-y-[1px]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'themes' && <ThemesTab />}
        {activeTab === 'landing' && <LandingPageTab />}
        {activeTab !== 'general' && activeTab !== 'themes' && activeTab !== 'landing' && (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                Conteúdo da aba {activeTab} (Placeholder)
            </div>
        )}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-20">
         <Button 
            className="bg-[#0B0F19] text-white shadow-2xl px-8 py-4 h-auto rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
            onClick={handleSave}
            isLoading={isSaving}
         >
            {isSaving ? 'Salvando...' : (
              <>
                <Save size={20} /> Salvar Todas as Configurações
              </>
            )}
         </Button>
      </div>
    </div>
  );
};