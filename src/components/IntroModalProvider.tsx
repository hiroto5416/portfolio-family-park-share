'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import IntroductionModal from './IntroductionModal';

interface IntroModalContextType {
  openIntroModal: () => void;
}

const IntroModalContext = createContext<IntroModalContextType | undefined>(undefined);

export function useIntroModal() {
  const context = useContext(IntroModalContext);
  if (!context) {
    throw new Error('useIntroModal must be used within an IntroModalProvider');
  }
  return context;
}

interface IntroModalProviderProps {
  children: ReactNode;
}

const IntroModalProvider = ({ children }: IntroModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // モーダルを閉じる関数
  const handleClose = () => {
    setIsOpen(false);
    // ローカルストレージにフラグを保存して、次回訪問時に表示しないようにする
    localStorage.setItem('hasSeenIntroduction', 'true');
  };

  // モーダルを開く関数
  const openIntroModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setIsMounted(true);
    // ページロード時にローカルストレージをチェックして、初めての訪問かどうかを確認
    const hasSeenIntroduction = localStorage.getItem('hasSeenIntroduction');

    // 初めての訪問の場合、モーダルを表示
    if (!hasSeenIntroduction) {
      setIsOpen(true);
    }
  }, []);

  return (
    <IntroModalContext.Provider value={{ openIntroModal }}>
      {children}
      {isMounted && <IntroductionModal isOpen={isOpen} onClose={handleClose} />}
    </IntroModalContext.Provider>
  );
};

export default IntroModalProvider;
