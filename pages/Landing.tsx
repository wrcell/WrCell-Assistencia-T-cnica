import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  BarChart3, 
  Handshake, 
  Gift, 
  MessageCircle,
  Play,
  Check,
  Instagram,
  Sun,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white z-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Layers className="text-gray-900" size={24} />
              <span className="text-xl font-bold text-gray-900 font-heading tracking-tight">WrCell System</span>
            </Link>
            
            <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
              <a href="#home" className="hover:text-gray-900">Início</a>
              <a href="#features" className="hover:text-gray-900">Funcionalidades</a>
              <a href="#plans" className="hover:text-gray-900">Planos</a>
              <a href="#contact" className="hover:text-gray-900 flex items-center gap-1">
                <MessageCircle size={16} className="text-green-500" /> Contato
              </a>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-gray-600">
                <Sun size={18} />
              </button>
              <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-gray-900">
                Entrar
              </Link>
              <Link to="/register" className="bg-[#111827] text-white text-xs font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-800 transition-colors">
                Teste Grátis Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-32 bg-[#0B0F19] text-center px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading tracking-wide leading-tight mb-6">
            Venda, conserte e gerencie tudo com<br />
            inteligência artificial.
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-16 font-light">
            App completo para lojas de celular e informática. Organize suas<br />
            vendas, suporte e manutenção com tecnologia.
          </p>
          
          <div className="flex justify-center items-center gap-12 text-sm font-bold">
            <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
              Comece seu Teste Gratuito
            </Link>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Ver Funcionalidades
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-3">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Centralize sua operação com ferramentas inteligentes que economizam seu tempo e impulsionam suas vendas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Wrench} 
              title="Ordens de Serviço" 
              desc="Gestão completa do ciclo de reparo, com status, técnico, laudo e impressão de comprovantes." 
            />
            <FeatureCard 
              icon={Package} 
              title="Controle de Estoque" 
              desc="Gerencie peças e produtos com controle de estoque mínimo, QR Code e upload de fotos." 
            />
            <FeatureCard 
              icon={ShoppingCart} 
              title="Frente de Caixa (PDV)" 
              desc="Um PDV ágil para produtos e serviços, integrado ao controle de estoque e ao programa de fidelidade." 
            />
            <FeatureCard 
              icon={DollarSign} 
              title="Controle Financeiro" 
              desc="Gestão de caixa com aberturas, sangrias, fechamentos e histórico completo de movimentações." 
            />
            <FeatureCard 
              icon={Users} 
              title="Cadastro de Clientes" 
              desc="Mantenha um histórico completo de seus clientes, seus aparelhos e serviços realizados." 
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Relatórios Gerenciais" 
              desc="Analise o desempenho da sua empresa com gráficos de receita, lucro, produtos mais vendidos e mais." 
            />
            <FeatureCard 
              icon={Handshake} 
              title="Controle de Fiado" 
              desc="Gerencie as vendas a prazo com extrato individual por cliente e envie lembretes de cobrança via WhatsApp." 
            />
            <FeatureCard 
              icon={Gift} 
              title="Programa de Fidelidade" 
              desc="Recompense seus clientes com pontos a cada compra e converta-os em descontos, incentivando a recorrência." 
            />
            <FeatureCard 
              icon={MessageCircle} 
              title="Notificações Automáticas" 
              desc="Dispare mensagens via WhatsApp para aniversariantes, clientes com saldo devedor ou para avisar sobre aparelhos prontos." 
            />
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="bg-[#1a1a1a] rounded-lg aspect-video flex items-center justify-center shadow-2xl relative group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                 <div className="h-16 w-16 rounded-full border-2 border-white flex items-center justify-center text-white z-10 group-hover:scale-110 transition-transform">
                    <Play fill="white" size={24} className="ml-1" />
                 </div>
                 <span className="absolute bottom-4 left-4 text-white text-xs font-mono">0:00</span>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">
                Demonstração Visual do<br />Sistema
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Veja na prática como nossa plataforma pode simplificar a gestão da
                sua assistência técnica. Do check-in do aparelho à finalização da
                Ordem de Serviço, tudo é pensado para otimizar seu tempo e aumentar
                sua produtividade.
              </p>
              <button className="bg-[#0F172A] text-white px-6 py-3 rounded text-sm font-bold hover:bg-gray-800 transition-colors">
                Quero Testar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-3">
              Planos Flexíveis para o seu Negócio
            </h2>
            <p className="text-gray-500">
              Escolha o plano que melhor se adapta à sua necessidade. Sem taxas escondidas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">Básico</h3>
              <div className="flex items-baseline mb-8">
                 <span className="text-3xl font-bold text-gray-900">R$19,90</span>
                 <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-600 w-full text-left pl-4">
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-400" /> Ordens de Serviço</li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-400" /> Cadastro de Clientes</li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-400" /> Controle de Estoque</li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-400" /> Ponto de Venda (PDV)</li>
              </ul>
              <button className="w-full bg-[#0F172A] text-white py-3 rounded-lg text-sm font-bold hover:bg-gray-800 mt-auto">
                Escolher Plano Básico
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-[#0F172A] rounded-xl p-8 flex flex-col items-center text-center relative shadow-xl transform scale-105 bg-white">
              <div className="absolute -top-3 bg-[#0F172A] text-white text-xs font-bold px-4 py-1 rounded-full">
                Mais Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">Pro</h3>
              <div className="flex items-baseline mb-8">
                 <span className="text-3xl font-bold text-gray-900">R$49,90</span>
                 <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-600 w-full text-left pl-4">
                <li className="flex items-start"><Check size={14} className="mr-2 text-gray-900 mt-1" /> 
                  <span className="font-bold text-gray-900">Todos os recursos do plano Básico</span>
                </li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-900" /> Relatórios Avançados</li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-900" /> Programa de Fidelidade</li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-900" /> Controle de Múltiplas Empresas</li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-900" /> Gerador de Landing Page com IA</li>
              </ul>
              <button className="w-full bg-[#0F172A] text-white py-3 rounded-lg text-sm font-bold hover:bg-gray-800 mt-auto">
                Escolher Plano Pro
              </button>
            </div>

            {/* Annual Plan */}
            <div className="border border-red-500 rounded-xl p-8 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">Anual</h3>
              <div className="flex items-baseline mb-8">
                 <span className="text-3xl font-bold text-gray-900">R$439,00</span>
                 <span className="text-gray-500 ml-1">/ano</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-600 w-full text-left pl-4">
                <li className="flex items-start"><Check size={14} className="mr-2 text-gray-900 mt-1" /> 
                  <span className="font-bold text-gray-900">Todos os recursos do Plano Pro</span>
                </li>
                <li className="flex items-start"><Check size={14} className="mr-2 text-gray-900 mt-1" /> 
                  <div>
                    <span className="font-bold text-gray-900">Desconto de 2 meses</span> em relação ao plano Pro mensal
                  </div>
                </li>
                <li className="flex items-center"><Check size={14} className="mr-2 text-gray-900" /> Suporte Prioritário</li>
              </ul>
              <button className="w-full bg-[#EF4444] text-white py-3 rounded-lg text-sm font-bold hover:bg-red-600 mt-auto shadow-md shadow-red-200">
                Economize com o Anual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-gray-500 mb-16">
            Veja como o WrCell está ajudando outras lojas a crescerem.
          </p>

          <div className="flex items-center justify-center gap-6">
            <button className="p-2 border rounded-full hover:bg-gray-50 text-gray-400 hidden md:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
              <TestimonialCard 
                name="Ricardo Lima"
                role="Técnico Autônomo"
                text="Como técnico autônomo, a organização que o WrCell me deu foi fundamental para crescer meu negócio. Indispensável!"
                image="https://randomuser.me/api/portraits/men/32.jpg"
              />
              <TestimonialCard 
                name="Fernanda Souza"
                role="Proprietária, Conecta-Tudo"
                text="O suporte é rápido e eficiente. Sempre que tive uma dúvida, fui atendida com muita atenção. Isso faz toda a diferença."
                image="https://randomuser.me/api/portraits/women/44.jpg"
              />
              <TestimonialCard 
                name="João Silva"
                role="Dono, JS Celulares"
                text="O sistema transformou a gestão da minha loja. As Ordens de Serviço ficaram muito mais organizadas e o controle de estoque me poupa horas."
                image="https://randomuser.me/api/portraits/men/85.jpg"
              />
            </div>

            <button className="p-2 border rounded-full hover:bg-gray-50 text-gray-400 hidden md:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer/Contact */}
      <section id="contact" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 font-heading mb-2">Fale Conosco</h2>
        <p className="text-gray-500 mb-8">Tem alguma dúvida? Nossa equipe está pronta para te ajudar.</p>
        
        <div className="flex justify-center gap-4 mb-24">
          <button className="bg-[#1a1a1a] text-white px-6 py-2 rounded flex items-center gap-2 text-sm font-medium hover:bg-gray-800">
            <Instagram size={18} /> Instagram
          </button>
          <button className="border border-gray-200 text-gray-700 px-6 py-2 rounded flex items-center gap-2 text-sm font-medium hover:bg-gray-50">
            <MessageCircle size={18} className="text-green-600" /> WhatsApp
          </button>
        </div>

        <div className="border-t border-gray-100 pt-8 max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <Layers size={16} />
             <span className="font-bold text-gray-900">WrCell System</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Início</a>
            <a href="#" className="hover:text-gray-900">Funcionalidades</a>
            <a href="#" className="hover:text-gray-900">Planos</a>
            <a href="#" className="hover:text-gray-900">Suporte</a>
            <a href="#" className="hover:text-gray-900">Política de Privacidade</a>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <Icon size={24} className="text-gray-900" strokeWidth={1.5} />
      <h3 className="font-bold text-gray-900 font-heading">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 leading-relaxed">
      {desc}
    </p>
  </div>
);

const TestimonialCard = ({ name, role, text, image }: any) => (
  <div className="bg-white p-8 rounded-lg border border-gray-100 text-center shadow-sm">
    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white shadow-sm">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex justify-center mb-4 space-x-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      ))}
    </div>
    <p className="text-gray-500 text-sm italic mb-6">"{text}"</p>
    <h4 className="font-bold text-gray-900 font-heading">{name}</h4>
    <p className="text-xs text-gray-400">{role}</p>
  </div>
);