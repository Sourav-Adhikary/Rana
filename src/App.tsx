import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, History, X, Minus, Plus, Equal, Divide, RotateCcw } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = () => {
    if (prevValue === null || operation === null) return;
    const current = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '*': result = prevValue * current; break;
      case '/': result = prevValue / current; break;
    }
    
    const calculationStr = `${prevValue} ${operation} ${current} = ${result}`;
    setHistory(prev => [calculationStr, ...prev].slice(0, 10));
    
    setDisplay(result.toString());
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const handleOperation = (op: Operation) => {
    if (prevValue !== null && !isNewNumber) {
      calculate();
    }
    setPrevValue(parseFloat(display));
    setOperation(op);
    setIsNewNumber(true);
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const percentage = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleNumber(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === '+') handleOperation('+');
      if (e.key === '-') handleOperation('-');
      if (e.key === '*') handleOperation('*');
      if (e.key === '/') handleOperation('/');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Backspace') backspace();
      if (e.key === 'Escape') clear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operation, isNewNumber]);

  const Button = ({ children, onClick, className = '', variant = 'default' }: { 
    children: ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: 'default' | 'operator' | 'action' | 'special'
  }) => {
    const variants = {
      default: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
      operator: 'bg-orange-500 text-white hover:bg-orange-400',
      action: 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600',
      special: 'bg-zinc-600 text-zinc-100 hover:bg-zinc-500'
    };

    return (
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className={`h-16 w-full rounded-2xl text-xl font-medium transition-colors flex items-center justify-center ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[360px] bg-zinc-900 rounded-[2.5rem] p-6 shadow-2xl border border-zinc-800 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <History size={20} />
          </button>
        </div>

        {/* Display */}
        <div className="mb-8 px-2 text-right">
          <div className="h-6 text-zinc-500 text-sm mb-1 overflow-hidden whitespace-nowrap">
            {prevValue !== null && `${prevValue} ${operation || ''}`}
          </div>
          <motion.div 
            key={display}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-light text-white tracking-tight break-all"
          >
            {display}
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={clear} variant="action">AC</Button>
          <Button onClick={toggleSign} variant="action">+/-</Button>
          <Button onClick={percentage} variant="action">%</Button>
          <Button onClick={() => handleOperation('/')} variant="operator">
            <Divide size={24} />
          </Button>

          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button onClick={() => handleOperation('*')} variant="operator">
            <X size={24} />
          </Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button onClick={() => handleOperation('-')} variant="operator">
            <Minus size={24} />
          </Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button onClick={() => handleOperation('+')} variant="operator">
            <Plus size={24} />
          </Button>

          <Button onClick={() => handleNumber('0')} className="col-span-1">0</Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button onClick={backspace}>
            <Delete size={24} />
          </Button>
          <Button onClick={calculate} variant="operator">
            <Equal size={24} />
          </Button>
        </div>

        {/* History Overlay */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute inset-0 bg-zinc-900/95 backdrop-blur-md p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-zinc-100 font-medium flex items-center gap-2">
                  <History size={18} /> History
                </h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-zinc-600 text-center mt-20">No history yet</div>
                ) : (
                  history.map((item, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="text-right border-b border-zinc-800 pb-2"
                    >
                      <div className="text-zinc-300 text-lg">{item}</div>
                    </motion.div>
                  ))
                )}
              </div>
              {history.length > 0 && (
                <button 
                  onClick={() => setHistory([])}
                  className="mt-4 py-3 text-zinc-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={14} /> Clear History
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
      `}</style>
    </div>
  );
}
