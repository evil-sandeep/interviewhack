import React from 'react';
import Header from './Header';
import ChatContainer from '../chat/ChatContainer';
import ChatInput from '../chat/ChatInput';

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header />
      <main className="flex-1 overflow-hidden relative max-w-5xl mx-auto w-full flex flex-col pt-4 px-4 sm:px-6">
        <ChatContainer />
        <ChatInput />
      </main>
    </div>
  );
};

export default MainLayout;
