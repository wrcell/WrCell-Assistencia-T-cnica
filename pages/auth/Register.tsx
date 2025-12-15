import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Layers, Eye, EyeOff, X, Award, Star, Crown, Medal } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('trial');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 font-sans backdrop-blur-sm bg-opacity-95">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl relative animate-fade-in overflow-hidden">
        
        {/* Close Button */}
        <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </Link>

        <div className="p-8 pt-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading tracking-tight mb-1">Crie sua Conta</h2>
            <p className="text-sm text-gray-500">Comece seu teste gratuito de 7 dias.</p>
            
            <div className="mt-6 flex justify-center">
              <Layers size={40} className="text-[#0B0F19]" strokeWidth={1.5} />
            </div>
          </div>

          <form className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-800 font-heading">Nome da Empresa ou Responsável</label>
              <input 
                type="text" 
                name="name"
                placeholder="Ex: WR Cell ou Wellyngton Reis"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all placeholder-gray-400"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-800 font-heading">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all placeholder-gray-400"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-800 font-heading">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="space-y-2 pt-2">
              <label className="block text-sm font-bold text-gray-800 font-heading">Escolha seu Plano</label>
              <div className="grid grid-cols-4 gap-2">
                
                {/* Trial Plan */}
                <div 
                  onClick={() => setSelectedPlan('trial')}
                  className={`cursor-pointer rounded-lg border flex flex-col items-center justify-center py-3 px-1 text-center transition-all h-[90px] ${
                    selectedPlan === 'trial' 
                      ? 'border-2 border-[#1a1a1a] bg-gray-100 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Medal size={20} className="text-blue-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 leading-tight">Teste<br/>Grátis</span>
                </div>

                {/* Basic Plan */}
                <div 
                  onClick={() => setSelectedPlan('basic')}
                  className={`cursor-pointer rounded-lg border flex flex-col items-center justify-center py-3 px-1 text-center transition-all h-[90px] ${
                    selectedPlan === 'basic' 
                      ? 'border-2 border-[#1a1a1a] bg-gray-100 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Star size={20} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 leading-tight">Básico</span>
                  <span className="text-[9px] text-gray-500 mt-0.5">R$ 19,90/mês</span>
                </div>

                {/* Pro Plan */}
                <div 
                  onClick={() => setSelectedPlan('pro')}
                  className={`cursor-pointer rounded-lg border flex flex-col items-center justify-center py-3 px-1 text-center transition-all h-[90px] ${
                    selectedPlan === 'pro' 
                      ? 'border-2 border-[#1a1a1a] bg-gray-100 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Crown size={20} className="text-yellow-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 leading-tight">Pro</span>
                  <span className="text-[9px] text-gray-500 mt-0.5">R$ 49,90/mês</span>
                </div>

                {/* Annual Plan */}
                <div 
                  onClick={() => setSelectedPlan('annual')}
                  className={`relative cursor-pointer rounded-lg border flex flex-col items-center justify-center py-3 px-1 text-center transition-all h-[90px] overflow-hidden ${
                    selectedPlan === 'annual' 
                      ? 'border-2 border-[#1a1a1a] bg-gray-100 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Ribbon */}
                  <div className="absolute top-0 right-0">
                    <div className="bg-red-500 text-white text-[6px] font-bold px-4 py-0.5 transform rotate-45 translate-x-[14px] translate-y-[4px] shadow-sm">
                      Promoção
                    </div>
                  </div>
                  
                  <Award size={20} className="text-green-500 mb-1 mt-1" />
                  <span className="text-[10px] font-bold text-gray-900 leading-tight">Anual</span>
                  <span className="text-[9px] text-gray-500 mt-0.5">R$ 439,00/ano</span>
                </div>

              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded cursor-pointer"
                checked={formData.terms}
                onChange={handleInputChange}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                Eu li e concordo com os <a href="#" className="underline hover:text-gray-800">Termos de Uso</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#8A8F98] hover:bg-[#717680] text-white font-medium py-3 rounded-lg text-sm transition-colors shadow-sm mt-2"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            >
              Criar conta
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-gray-400 uppercase">ou</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 bg-white"
              >
                <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45Z"
                    stroke="none"
                    fill="none"
                  />
                  <path
                    d="M20.45 12c0-.5833-.05-1.15-.15-1.7H12v3.2167h4.7333c-.2 1.0833-.8167 2-1.75 2.6166v2.1667h2.8333c1.6667-1.5333 2.6334-3.7833 2.6334-6.3Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 20.45c2.3833 0 4.3833-.7833 5.8333-2.1333l-2.8333-2.1667c-.8.5333-1.8167.85-3 .85-2.2833 0-4.2167-1.55-4.9-3.6333H4.1833v2.2666C5.6333 18.5 9.0833 20.45 12 20.45Z"
                    fill="#34A853"
                  />
                  <path
                    d="M7.1 13.3667c-.1833-.55-.2833-1.1334-.2833-1.7334 0-.6.1-1.1833.2833-1.7333V7.6333H4.1833C3.5833 8.8167 3.25 10.1667 3.25 12c0 1.8333.3333 3.1833.9333 4.3667l2.9167-2.2667Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 6.9333c1.2833 0 2.4333.45 3.3333 1.3167l2.5-2.5C16.3667 4.3667 14.3667 3.55 12 3.55c-2.9167 0-6.3667 1.95-7.8167 4.8167l2.9167 2.2666C7.7833 8.4833 9.7167 6.9333 12 6.9333Z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button 
                type="button" 
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 bg-white"
              >
                <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.048 0-2.488.95-2.488 2.475v1.497h3.96l-.603 3.667h-3.357v7.98h-5.328Z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};