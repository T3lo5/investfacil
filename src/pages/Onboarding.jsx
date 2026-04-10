import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding({ user, setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    goal: '',
    horizon: '',
    risk: '',
    initialAmount: '',
    monthlyContribution: ''
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, profile };
    localStorage.setItem('investfacil_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Vamos definir seu Perfil de Investidor
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold">Qual seu objetivo principal?</h3>
            <select name="goal" value={profile.goal} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="">Selecione...</option>
              <option value="aposentadoria">Aposentadoria</option>
              <option value="casa">Comprar Casa</option>
              <option value="viagem">Viagem</option>
              <option value="liberdade">Liberdade Financeira</option>
            </select>
            
            <h3 className="text-lg font-semibold pt-4">Em quanto tempo quer atingir esse objetivo?</h3>
            <select name="horizon" value={profile.horizon} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="">Selecione...</option>
              <option value="curto">Curto Prazo (1-3 anos)</option>
              <option value="medio">Médio Prazo (3-10 anos)</option>
              <option value="longo">Longo Prazo (+10 anos)</option>
            </select>
            
            <button type="button" onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">Próximo</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold">Qual seu tolerância a risco?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['conservador', 'moderado', 'agressivo'].map((type) => (
                <label key={type} className={`p-4 border rounded-lg cursor-pointer text-center capitalize transition ${profile.risk === type ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <input type="radio" name="risk" value={type} checked={profile.risk === type} onChange={handleChange} className="hidden" required />
                  <span className="font-medium">{type}</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {type === 'conservador' ? 'Prefere segurança total' : type === 'moderado' ? 'Equilíbrio entre risco e retorno' : 'Busca máxima rentabilidade'}
                  </p>
                </label>
              ))}
            </div>

            <h3 className="text-lg font-semibold pt-4">Situação Financeira</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Disponível para investir hoje (R$)</label>
                <input type="number" name="initialAmount" value={profile.initialAmount} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm mb-1">Aporte mensal (R$)</label>
                <input type="number" name="monthlyContribution" value={profile.monthlyContribution} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="0.00" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400">Voltar</button>
              <button type="submit" className="w-2/3 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold">Finalizar e Ver Dashboard</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
