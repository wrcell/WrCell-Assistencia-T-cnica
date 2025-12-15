import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';

export const Settings: React.FC = () => {
  const { accentColor, setAccentColor } = useTheme();

  const presets = [
    '#007BFF', // Blue (Default)
    '#28A745', // Green
    '#DC3545', // Red
    '#FD7E14', // Orange
    '#6610F2', // Purple
    '#E83E8C', // Pink
    '#20C997', // Teal
    '#111827', // Gray/Black
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie as preferências e configurações do sistema.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100 font-heading">Personalização</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 font-heading">Cor de Destaque</label>
            <p className="text-sm text-gray-500 mb-4">
              Escolha a cor principal que será utilizada em botões, ícones e destaques do sistema.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              {presets.map(color => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-10 h-10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 ${
                    accentColor.toLowerCase() === color.toLowerCase() 
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' 
                      : 'hover:scale-105 border border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Selecionar cor ${color}`}
                  title={color}
                />
              ))}
              
              <div className="relative ml-2 group">
                 <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-400 group-hover:bg-gray-50 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                 </div>
                 <input 
                   type="color" 
                   value={accentColor}
                   onChange={(e) => setAccentColor(e.target.value)}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   title="Cor Personalizada"
                 />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3 font-heading">Pré-visualização</h3>
            <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
               <Button>Botão Primário</Button>
               <span className="text-accent font-bold font-heading">Texto em Destaque</span>
               <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs">Icon</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm opacity-50 pointer-events-none">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-heading">Dados da Empresa</h2>
        <p className="text-sm text-gray-500">Configurações de CNPJ, endereço e contato (Em breve).</p>
      </div>
    </div>
  );
};