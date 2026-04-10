export default function MockDataWarning({ isUsingMockData }) {
  if (!isUsingMockData) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded shadow-sm">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-semibold">Dados Simulados</span>
      </div>
      <p className="mt-1 text-sm">
        Não foi possível conectar à API de dados financeiros. Os dados exibidos são simulados e podem não refletir os valores reais de mercado. Verifique sua conexão ou tente novamente mais tarde.
      </p>
    </div>
  );
}
