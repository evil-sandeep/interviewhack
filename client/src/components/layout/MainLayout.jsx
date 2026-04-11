import React from 'react';
import Header from './Header';
import ChatContainer from '../chat/ChatContainer';

const MainLayout = () => {
  return (
    // Deleted mock background. Pure transparency map to let OS show through natively!
    <div className="h-screen w-full flex flex-col items-center bg-transparent text-white p-4 font-sans relative overflow-hidden">
      
      {/* Top Floating Control Bar Widget */}
      <Header />
      
      {/* Centered Secret Terminal Float Map */}
      <main className="flex-1 w-full max-w-[850px] flex flex-col mt-6 z-10 transition-all pointer-events-none">
        
        {/* Reactivating pointer events just for the container so background stays pass-through */}
        <div className="flex-1 pointer-events-auto flex flex-col items-center w-full">
           <ChatContainer />
        </div>
      </main>
      
    </div>
  );
};

export default MainLayout;
