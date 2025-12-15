import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company, PixKey, BankAccount } from '../types';
import { MOCK_COMPANY } from '../services/mockData';

interface CompanyContextType {
  company: Company;
  updateCompany: (data: Partial<Company>) => void;
  pixKeys: PixKey[];
  addPixKey: (key: PixKey) => void;
  removePixKey: (id: string) => void;
  bankAccounts: BankAccount[];
  addBankAccount: (account: BankAccount) => void;
  removeBankAccount: (id: string) => void;
  
  // Subscription Status
  isTrialActive: boolean;
  daysRemaining: number;
  isAccountReadOnly: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Mock Data
  const [company, setCompany] = useState<Company>(() => {
    const saved = localStorage.getItem('wrcell_company');
    return saved ? JSON.parse(saved) : { ...MOCK_COMPANY, phone: '41996821575', address: 'Rua Luiz Fuentes Robaina, n 333' };
  });

  const [pixKeys, setPixKeys] = useState<PixKey[]>(() => {
    const saved = localStorage.getItem('wrcell_pix_keys');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'CNPJ', key: '00.000.000/0001-00' }
    ];
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('wrcell_bank_accounts');
    return saved ? JSON.parse(saved) : [
      { id: '1', bank: 'Banco do Brasil', agency: '1234-5', account: '102030-X', holder: 'WrCell LTDA' }
    ];
  });

  // Calculate Subscription Status
  const calculateSubscription = () => {
    const createdDate = new Date(company.createdAt);
    const now = new Date();
    const trialDays = 7;
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Logic: 
    // 1. If plan is 'trial' and diffDays <= 7 -> Active Trial
    // 2. If plan is 'trial' and diffDays > 7 -> Expired (Read Only)
    // 3. If plan is 'basic', 'pro', 'annual' -> Active Paid (Unless status blocked)

    const isTrial = company.plan === 'trial';
    const isTrialExpired = isTrial && diffDays > trialDays;
    
    const daysRemaining = isTrial ? Math.max(0, trialDays - diffDays) : 365;
    
    // Read Only if trial expired OR manually blocked
    const isAccountReadOnly = (isTrialExpired && company.plan === 'trial') || company.status === 'blocked';

    return {
        isTrialActive: isTrial && !isTrialExpired,
        daysRemaining,
        isAccountReadOnly
    };
  };

  const { isTrialActive, daysRemaining, isAccountReadOnly } = calculateSubscription();

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('wrcell_company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('wrcell_pix_keys', JSON.stringify(pixKeys));
  }, [pixKeys]);

  useEffect(() => {
    localStorage.setItem('wrcell_bank_accounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  // Actions
  const updateCompany = (data: Partial<Company>) => {
    setCompany(prev => ({ ...prev, ...data }));
  };

  const addPixKey = (key: PixKey) => {
    setPixKeys(prev => [...prev, key]);
  };

  const removePixKey = (id: string) => {
    setPixKeys(prev => prev.filter(k => k.id !== id));
  };

  const addBankAccount = (account: BankAccount) => {
    setBankAccounts(prev => [...prev, account]);
  };

  const removeBankAccount = (id: string) => {
    setBankAccounts(prev => prev.filter(k => k.id !== id));
  };

  return (
    <CompanyContext.Provider value={{
      company,
      updateCompany,
      pixKeys,
      addPixKey,
      removePixKey,
      bankAccounts,
      addBankAccount,
      removeBankAccount,
      isTrialActive,
      daysRemaining,
      isAccountReadOnly
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};