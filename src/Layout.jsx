export default function Layout({ children }) {
  return (
    <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 min-h-screen">
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overscroll-behavior: none;
        }
        input[type="time"]::-webkit-calendar-picker-indicator { display: none; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
      {children}
    </div>
  );
}