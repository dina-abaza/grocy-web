"use client";

export default function AdminTopbar() {
  return (
    <header className="h-[70px] bg-white dark:bg-gray-900 flex items-center px-8 border-b border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-800 dark:text-white flex gap-1.5">
        مرحباً بك
        <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
      </h3>

      <style jsx>{`
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
