import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { api } from '../../../services/api';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../stores/auth.store';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function AiInsightsFeed() {
  const organizationId = useAuthStore(state => state.organizationId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customAnalysis, setCustomAnalysis] = useState('');
  const [analyzingPrompt, setAnalyzingPrompt] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [selectedType, selectedStatus]);

  async function fetchInsights() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      let query = `/ai/insights?organizationId=${organizationId}`;
      if (selectedType !== 'ALL') query += `&insightType=${selectedType}`;
      if (selectedStatus !== 'ALL') query += `&status=${selectedStatus}`;
      const res = await api.get(query);
      setInsights(res.data || []);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateInsightStatus(id: string, status: string) {
    if (!organizationId) return;
    try {
      await api.patch(`/ai/insights/${id}/status?organizationId=${organizationId}`, { status });
      setInsights((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  async function handleTriggerGenerate() {
    if (!organizationId) return;
    setGenerating(true);
    try {
      await api.post('/ai/insights/generate', { organizationId });
      await fetchInsights();
    } catch (err) {
      console.error('Failed to generate insights:', err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleRunCustomPrompt() {
    if (!customPrompt.trim() || !organizationId) return;
    setAnalyzingPrompt(true);
    try {
      const res = await api.post('/ai/summaries/enrich', {
        organizationId,
        customPrompt,
      });
      setCustomAnalysis(res.data?.enrichedSummary || 'Analysis completed.');
    } catch (err) {
      setCustomAnalysis('Failed to process custom query. Please try again.');
    } finally {
      setAnalyzingPrompt(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center space-x-3 mb-1">
            <Text className="text-3xl font-extrabold text-white tracking-tight">AI Insights Feed</Text>
            <View className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex-row items-center space-x-1">
              <Ionicons name="sparkles" size={14} color="#6366f1" />
              <Text className="text-xs font-bold text-indigo-400">OpenAI & Custom LLM</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm">
            Actionable business recommendations, ingredient depletion predictions & LLM queries
          </Text>
        </View>

        <TouchableOpacity
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl flex-row items-center space-x-2 shadow-lg shadow-indigo-500/25"
          onPress={handleTriggerGenerate}
          disabled={generating}
        >
          <Ionicons name="flash" size={16} color="#ffffff" />
          <Text className="text-white font-bold text-xs">
            {generating ? 'Analyzing Data...' : '⚡ Generate New AI Feed'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Interactive LLM Custom Prompt Box */}
      <Card
        title="🤖 Ask FoodOS AI Assistant"
        subtitle="Submit custom operational queries or request instant menu/inventory analysis"
        glow="indigo"
      >
        <View className="flex-row gap-2 mb-3">
          <TextInput
            className="flex-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
            placeholder="e.g. Predict ingredient requirement for 200 Butter Chicken orders..."
            placeholderTextColor="#64748b"
            value={customPrompt}
            onChangeText={setCustomPrompt}
          />
          <TouchableOpacity
            onPress={handleRunCustomPrompt}
            disabled={analyzingPrompt}
            className="bg-indigo-600 hover:bg-indigo-500 px-5 justify-center rounded-xl"
          >
            <Text className="text-white font-bold text-xs">
              {analyzingPrompt ? 'Processing...' : 'Run Query'}
            </Text>
          </TouchableOpacity>
        </View>

        {customAnalysis ? (
          <View className="bg-indigo-950/60 border border-indigo-500/30 p-4 rounded-xl mt-2">
            <Text className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              AI Copilot Response
            </Text>
            <Text className="text-sm text-indigo-100 leading-relaxed">{customAnalysis}</Text>
          </View>
        ) : null}
      </Card>

      {/* Category Filter Tabs */}
      <View className="flex-row gap-2 mb-4 overflow-x-auto pb-2">
        {['ALL', 'SALES_SURGE', 'STOCK_OUT_PREDICTION', 'PREP_DELAY', 'CUSTOMER_SENTIMENT'].map((type) => (
          <TouchableOpacity
            key={type}
            className={`px-4 py-2 rounded-xl border ${
              selectedType === type ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-slate-800'
            }`}
            onPress={() => setSelectedType(type)}
          >
            <Text className={`text-xs font-semibold ${selectedType === type ? 'text-white' : 'text-slate-400'}`}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Insights List */}
      {loading ? (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-slate-400 text-xs mt-2">Scanning multi-branch metrics...</Text>
        </View>
      ) : error ? (
        <ErrorState onRetry={fetchInsights} />
      ) : insights.length === 0 ? (
        <EmptyState 
          icon="sparkles-outline" 
          title="No AI Insights Found" 
          description="Your AI copilot has not generated any insights matching these filters."
        />
      ) : (
        <View className="gap-4">
          {insights.map((item) => (
            <Card key={item.id} className="mb-2">
              <View className="flex-row justify-between items-start mb-3 flex-wrap gap-2">
                <View className="flex-row items-center space-x-2">
                  <Badge label={item.severity} variant={item.severity} size="sm" />
                  <Badge label={item.status} variant={item.status} size="sm" />
                  <Text className="text-lg font-bold text-white">{item.title}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs font-mono font-bold text-indigo-400">{item.insightType}</Text>
                  {item.confidenceScore && (
                    <Text className="text-[10px] text-slate-500">
                      Confidence: {(item.confidenceScore * 100).toFixed(0)}%
                    </Text>
                  )}
                </View>
              </View>

              <Text className="text-slate-300 text-sm mb-3 leading-relaxed">{item.body}</Text>

              {item.recommendation && (
                <View className="bg-indigo-950/80 border border-indigo-500/20 p-3.5 rounded-xl mb-4">
                  <Text className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    Recommended Action
                  </Text>
                  <Text className="text-xs text-indigo-200">{item.recommendation}</Text>
                </View>
              )}

              <View className="flex-row justify-between items-center pt-3 border-t border-slate-800 flex-wrap gap-2">
                <Text className="text-xs text-slate-500">
                  Model: {item.modelProvider || 'OPENAI'} ({item.modelName || 'gpt-4o-mini'})
                </Text>
                <View className="flex-row space-x-2">
                  {item.status !== 'ACTIONED' && (
                    <TouchableOpacity
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
                      onPress={() => updateInsightStatus(item.id, 'ACTIONED')}
                    >
                      <Text className="text-xs font-bold text-emerald-400">Mark Acted On</Text>
                    </TouchableOpacity>
                  )}
                  {item.status !== 'DISMISSED' && (
                    <TouchableOpacity
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
                      onPress={() => updateInsightStatus(item.id, 'DISMISSED')}
                    >
                      <Text className="text-xs font-semibold text-rose-400">Dismiss</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
