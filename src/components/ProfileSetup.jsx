import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    profile_type: 'moderado',
    risk_tolerance: 3,
    investment_horizon: 10,
    monthly_investment: '',
    current_savings: '',
    future_goal: '',
    goal_description: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
          setFormData({
            profile_type: data.profile.profile_type,
            risk_tolerance: data.profile.risk_tolerance,
            investment_horizon: data.profile.investment_horizon,
            monthly_investment: data.profile.monthly_investment.toString(),
            current_savings: data.profile.current_savings.toString(),
            future_goal: data.profile.future_goal.toString(),
            goal_description: data.profile.goal_description || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          risk_tolerance: parseInt(formData.risk_tolerance),
          investment_horizon: parseInt(formData.investment_horizon),
          monthly_investment: parseFloat(formData.monthly_investment),
          current_savings: parseFloat(formData.current_savings) || 0,
          future_goal: parseFloat(formData.future_goal)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      alert('Perfil salvo com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao salvar perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {profile ? 'Editar Perfil de Investidor' : 'Criar Perfil de Investidor'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Profile Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Perfil de Investidor
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['conservador', 'moderado', 'agressivo'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, profile_type: type })}
                className={`py-3 px-4 rounded-lg border-2 transition-colors capitalize ${
                  formData.profile_type === type
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {formData.profile_type === 'conservador' && 'Prioriza segurança e preservação de capital'}
            {formData.profile_type === 'moderado' && 'Equilíbrio entre segurança e crescimento'}
            {formData.profile_type === 'agressivo' && 'Foco em maximizar retornos, aceita mais risco'}
          </p>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tolerância ao Risco (1-5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.risk_tolerance}
            onChange={(e) => setFormData({ ...formData, risk_tolerance: e.target.value })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Mínima (1)</span>
            <span className="font-semibold">{formData.risk_tolerance}</span>
            <span>Máxima (5)</span>
          </div>
        </div>

        {/* Investment Horizon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Horizonte de Investimento (anos)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.investment_horizon}
            onChange={(e) => setFormData({ ...formData, investment_horizon: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Monthly Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Investimento Mensal (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.monthly_investment}
            onChange={(e) => setFormData({ ...formData, monthly_investment: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Current Savings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Economias Atuais (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.current_savings}
            onChange={(e) => setFormData({ ...formData, current_savings: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Future Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Objetivo Financeiro Futuro (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.future_goal}
            onChange={(e) => setFormData({ ...formData, future_goal: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Goal Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição do Objetivo (opcional)
          </label>
          <textarea
            value={formData.goal_description}
            onChange={(e) => setFormData({ ...formData, goal_description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows="3"
            placeholder="Ex: Aposentadoria, Compra de imóvel, Educação dos filhos..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
}
