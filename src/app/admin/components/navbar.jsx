"use client";

export default function AdminTopbar() {
  return (
    <header className="topbar">
      <h3>
        مرحباً بك
        <span className="wave-hand">👋</span>
      </h3>

      <style jsx>{`
        .topbar {
          height: 70px;
          background: #ffffff;
          display: flex;
          align-items: center;
          padding: 0 30px;
          border-bottom: 1px solid #e2e8f0;
        }

        .topbar h3 {
          font-weight: 600;
          color: #1e293b;
          display: flex;
          gap: 6px;
        }

        .wave-hand {
          display: inline-block;
          animation: wave 1.5s infinite;
          transform-origin: 70% 70%;
        }

        @keyframes wave {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-10deg); }
          45% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          75% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </header>
  );
}
