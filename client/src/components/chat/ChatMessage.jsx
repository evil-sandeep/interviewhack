import React from 'react';

const ChatMessage = ({ msg }) => {
  const isQuestion = msg.sender === 'user';
  
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Explodes raw strings natively into heavily formatted arrays mimicking the 
   * extremely specific bullet-point lists featured in the screenshot constraint.
   */
  const renderFormattedText = (text) => {
    if (isQuestion) return text; // Renders unstyled directly into the header block

    // Parse AI multi-line output explicitly into separate bulleted structures
    const blocks = text.split('\n').filter(b => b.trim() !== '');
    return (
      <ul className="space-y-3 mt-2 pr-4 ml-1">
        {blocks.map((block, i) => {
           // Strip any markdown leading lists characters
           const cleanBlock = block.replace(/^[-*]\s*/, '');
           return (
             <li key={i} className="flex relative pl-5 tracking-wide">
               <span className="absolute left-0 top-2.5 w-[5px] h-[5px] bg-zinc-400 rounded-full"></span>
               <span className="text-[14.5px] leading-relaxed text-zinc-200 font-medium">{cleanBlock}</span>
             </li>
           )
        })}
      </ul>
    );
  };

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300 relative group flex flex-col">
      
      {isQuestion ? (
        // Question Structure Model
        <h2 className="text-white flex gap-2.5 items-start">
           <span className="text-lg leading-none shrink-0 pt-0.5" role="img" aria-label="question">💬</span>
           <div className="tracking-wide">
             <span className="font-bold text-[15.5px] mr-1.5">Question:</span> 
             <span className="font-semibold text-[15.5px] text-zinc-100">{renderFormattedText(msg.text)}</span>
           </div>
        </h2>
      ) : (
        // Answer Structure Model
        <div className="mt-4 flex flex-col">
          <h3 className="text-amber-400 font-bold text-[15.5px] flex items-center gap-2.5 tracking-wide">
             <span className="text-[17px] leading-none text-yellow-500 shadow-yellow-500/20 drop-shadow-md">⭐</span> 
             Answer:
          </h3>
          <div className="pl-[29px]">
             {renderFormattedText(msg.text)}
          </div>
        </div>
      )}

      {/* Subtle Timestamp aligned properly */}
      {msg.timestamp && (
        <span className="block text-[11px] mt-4 ml-[29px] opacity-20 group-hover:opacity-50 transition-opacity text-zinc-400">
          {formatTime(msg.timestamp)}
        </span>
      )}
    </div>
  );
};

export default React.memo(ChatMessage);
