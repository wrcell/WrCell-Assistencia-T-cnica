import React, { useState } from 'react';
import { MOCK_SCHEDULINGS, MOCK_USERS, MOCK_SERVICES } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, Plus, User, Clock, X, Calendar as CalendarIcon, AlignLeft } from 'lucide-react';
import { Scheduling } from '../../types';

export const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Controls the month being viewed
  const [selectedDate, setSelectedDate] = useState(new Date()); // Controls the specific selected day
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Local state for schedulings to allow adding new ones in this session
  const [schedulings, setSchedulings] = useState<Scheduling[]>(MOCK_SCHEDULINGS);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '09:00',
    clientId: '',
    notes: ''
  });

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === month &&
           selectedDate.getFullYear() === year;
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === month &&
           today.getFullYear() === year;
  };

  // Open Modal and initialize form with selected date
  const openNewModal = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    setFormData({
      title: '',
      date: dateStr,
      time: '09:00',
      clientId: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Save new scheduling
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = `${formData.date}T${formData.time}:00`;
    
    const newScheduling: Scheduling = {
        id: String(Date.now()),
        companyId: '1',
        clientId: formData.clientId || '',
        title: formData.title,
        notes: formData.notes,
        employeeId: '1', // Default employee
        dateTime: dateTime,
        status: 'Agendado'
    };

    setSchedulings([...schedulings, newScheduling]);
    setIsModalOpen(false);
  };

  // Filter schedulings for the selected date
  // Note: Comparing ISO string YYYY-MM-DD parts
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const daysSchedulings = schedulings.filter(s => s.dateTime.startsWith(selectedDateStr));

  const getClientName = (id: string) => MOCK_USERS.find(u => u.id === id)?.firstName || 'Cliente não identificado';
  const getServiceName = (id?: string) => id ? (MOCK_SERVICES.find(s => s.id === id)?.name || '') : '';

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty slots for days before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day);
      const today = isToday(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm transition-all duration-200
            ${selected 
              ? 'bg-[#0B0F19] text-white shadow-md font-bold' 
              : today 
                ? 'bg-blue-50 text-blue-600 font-bold' 
                : 'text-gray-600 hover:bg-gray-100 font-medium'
            }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Agendamentos</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left Column: Calendar Widget */}
        <div className="w-full lg:w-7/12 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-10 w-full max-w-sm">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <span className="text-xl font-bold text-gray-900 capitalize font-heading select-none">
              {monthNames[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4 w-full max-w-sm">
            {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(d => (
              <div key={d} className="text-xs font-medium text-gray-400 uppercase select-none">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 place-items-center w-full max-w-sm">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Right Column: Day Details */}
        <div className="w-full lg:w-5/12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-heading tracking-tight">
                {selectedDate.toLocaleDateString('pt-BR')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Compromissos do dia</p>
            </div>
            <Button size="sm" onClick={openNewModal} className="bg-[#0B0F19]">
              <Plus size={16} className="mr-1" /> Novo
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {daysSchedulings.length > 0 ? (
              <div className="space-y-4">
                {daysSchedulings.map(s => (
                  <div key={s.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 transition-all group">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-white p-2 rounded-lg border border-gray-200 text-gray-900 font-bold text-sm">
                            {new Date(s.dateTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                            ${s.status === 'Agendado' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {s.status}
                          </span>
                        </div>
                     </div>
                     <div className="pl-1">
                        <div className="flex items-center text-sm font-bold text-gray-900 mb-1">
                           {s.title || getServiceName(s.serviceId) || 'Sem título'}
                        </div>
                        {s.clientId && (
                           <div className="flex items-center text-sm text-gray-500 gap-1.5">
                              <User size={14} />
                              {getClientName(s.clientId)}
                           </div>
                        )}
                        {s.notes && (
                           <div className="flex items-center text-xs text-gray-400 mt-2 gap-1.5">
                              <AlignLeft size={12} />
                              {s.notes}
                           </div>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center pb-8">
                 <p className="text-gray-500 font-medium">Nenhum agendamento para este dia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in relative">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Novo Agendamento</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Crie um novo compromisso para {new Date(formData.date + 'T12:00:00').toLocaleDateString('pt-BR')}.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
                
                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Título</label>
                    <input 
                        type="text" 
                        required
                        placeholder="Ex: Reunião com fornecedor"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* Date and Time */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Data e Hora</label>
                    <div className="relative">
                         <input 
                            type="datetime-local" 
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent bg-white transition-all appearance-none"
                            value={`${formData.date}T${formData.time}`}
                            onChange={(e) => {
                                const val = e.target.value;
                                if(val) {
                                     const [d, t] = val.split('T');
                                     setFormData({...formData, date: d, time: t});
                                }
                            }}
                         />
                         <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            <CalendarIcon size={18} />
                         </div>
                    </div>
                </div>

                {/* Client */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Cliente (Opcional)</label>
                    <div className="relative">
                      <select 
                           className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-accent focus:border-transparent appearance-none transition-all"
                           value={formData.clientId}
                           onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                      >
                          <option value="">Selecione um cliente</option>
                          {MOCK_USERS.filter(u => u.profile === 'client').map(c => (
                              <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                         <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Observações</label>
                    <textarea 
                        rows={3}
                        placeholder="Detalhes sobre o agendamento..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm resize-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                     <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)} className="px-6 h-11">Cancelar</Button>
                     <Button type="submit" className="bg-[#0B0F19] hover:bg-gray-800 text-white px-6 h-11">Salvar</Button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};