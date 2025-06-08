// File: src/components/creator/TriggerBuilder.tsx
import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Settings, TrendingUp, Zap, Activity, Palette } from 'lucide-react';

// Types for trigger system
interface DataTrigger {
  id: string;
  condition: TriggerCondition;
  action: TransformationAction;
  data_source: string;
  is_active: boolean;
  name: string;
}

interface TriggerCondition {
  field: string; // 'price' | 'sentiment' | 'volatility'
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: number | [number, number];
}

interface TransformationAction {
  property: 'color_scheme' | 'animation_speed' | 'opacity';
  value: string | number;
}

interface TriggerBuilderProps {
  onTriggersChange?: (triggers: DataTrigger[]) => void;
  initialTriggers?: DataTrigger[];
}

const TriggerBuilder: React.FC<TriggerBuilderProps> = ({ 
  onTriggersChange,
  initialTriggers = []
}) => {
  const [triggers, setTriggers] = useState<DataTrigger[]>(initialTriggers);
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<string | null>(null);
  const [previewTrigger, setPreviewTrigger] = useState<string | null>(null);

  // Configuration options
  const dataSourceOptions = [
    { value: 'market_sentiment', label: 'Market Sentiment', icon: TrendingUp, unit: 'score' },
    { value: 'crypto_prices', label: 'Crypto Price', icon: Activity, unit: 'USD' },
    { value: 'volatility_index', label: 'Volatility', icon: Zap, unit: '%' }
  ];

  const conditionFields = {
    market_sentiment: [
      { value: 'sentiment_score', label: 'Sentiment Score', range: [1, 10] },
      { value: 'trend', label: 'Market Trend', options: ['bullish', 'bearish', 'neutral'] }
    ],
    crypto_prices: [
      { value: 'price', label: 'Price', range: [0, 100000] },
      { value: 'price_change_24h', label: '24h Change', range: [-50, 50] }
    ],
    volatility_index: [
      { value: 'volatility', label: 'Volatility Level', options: ['low', 'medium', 'high'] },
      { value: 'volatility_score', label: 'Volatility Score', range: [0, 100] }
    ]
  };

  const operators = [
    { value: 'greater_than', label: 'Greater Than', symbol: '>' },
    { value: 'less_than', label: 'Less Than', symbol: '<' },
    { value: 'equals', label: 'Equals', symbol: '=' },
    { value: 'between', label: 'Between', symbol: '⟷' }
  ];

  const actionProperties = [
    { 
      value: 'color_scheme', 
      label: 'Color Scheme', 
      icon: Palette,
      options: [
        { value: 'purple-blue', label: 'Purple Blue' },
        { value: 'fire', label: 'Fire' },
        { value: 'ocean', label: 'Ocean' },
        { value: 'forest', label: 'Forest' },
        { value: 'sunset', label: 'Sunset' }
      ]
    },
    { 
      value: 'animation_speed', 
      label: 'Animation Speed', 
      icon: Zap,
      range: [0.5, 3],
      unit: 'x'
    },
    { 
      value: 'opacity', 
      label: 'Opacity', 
      icon: Eye,
      range: [0.3, 1],
      unit: '%'
    }
  ];

  // Create new trigger
  const createNewTrigger = (): DataTrigger => ({
    id: `trigger_${Date.now()}`,
    name: `Trigger ${triggers.length + 1}`,
    data_source: 'market_sentiment',
    condition: {
      field: 'sentiment_score',
      operator: 'greater_than',
      value: 7
    },
    action: {
      property: 'color_scheme',
      value: 'fire'
    },
    is_active: true
  });

  const addTrigger = () => {
    const newTrigger = createNewTrigger();
    const updatedTriggers = [...triggers, newTrigger];
    setTriggers(updatedTriggers);
    setEditingTrigger(newTrigger.id);
    setIsAddingTrigger(false);
    onTriggersChange?.(updatedTriggers);
  };

  const updateTrigger = (triggerId: string, updatedTrigger: Partial<DataTrigger>) => {
    const updatedTriggers = triggers.map(trigger =>
      trigger.id === triggerId ? { ...trigger, ...updatedTrigger } : trigger
    );
    setTriggers(updatedTriggers);
    onTriggersChange?.(updatedTriggers);
  };

  const deleteTrigger = (triggerId: string) => {
    const updatedTriggers = triggers.filter(trigger => trigger.id !== triggerId);
    setTriggers(updatedTriggers);
    onTriggersChange?.(updatedTriggers);
  };

  const toggleTriggerActive = (triggerId: string) => {
    updateTrigger(triggerId, { 
      is_active: !triggers.find(t => t.id === triggerId)?.is_active 
    });
  };

  const getConditionDescription = (trigger: DataTrigger) => {
    const operator = operators.find(op => op.value === trigger.condition.operator);
    const field = conditionFields[trigger.data_source as keyof typeof conditionFields]
      ?.find(f => f.value === trigger.condition.field);

    let valueText = '';
    if (trigger.condition.operator === 'between' && Array.isArray(trigger.condition.value)) {
      valueText = `${trigger.condition.value[0]} - ${trigger.condition.value[1]}`;
    } else {
      valueText = String(trigger.condition.value);
    }

    return `When ${field?.label} ${operator?.symbol} ${valueText}`;
  };

  const getActionDescription = (trigger: DataTrigger) => {
    const property = actionProperties.find(p => p.value === trigger.action.property);
    let valueText = String(trigger.action.value);
    
    if (trigger.action.property === 'opacity' && typeof trigger.action.value === 'number') {
      valueText = `${Math.round(trigger.action.value * 100)}%`;
    }

    return `Set ${property?.label} to ${valueText}`;
  };

  const renderTriggerCard = (trigger: DataTrigger) => {
    const isEditing = editingTrigger === trigger.id;
    const isPreviewing = previewTrigger === trigger.id;

    return (
      <div
        key={trigger.id}
        className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all ${
          trigger.is_active ? 'border-purple-500/50' : 'border-gray-700'
        } ${isPreviewing ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {(() => {
              const ds = dataSourceOptions.find(option => option.value === trigger.data_source);
              return ds ? <ds.icon className="w-5 h-5 text-purple-400" /> : null;
            })()}
            <input
              type="text"
              value={trigger.name}
              onChange={(e) => updateTrigger(trigger.id, { name: e.target.value })}
              className="bg-transparent text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewTrigger(isPreviewing ? null : trigger.id)}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              title="Preview trigger"
            >
              {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => toggleTriggerActive(trigger.id)}
              className={`p-2 transition-colors ${
                trigger.is_active ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'
              }`}
              title={trigger.is_active ? 'Disable trigger' : 'Enable trigger'}
            >
              <Zap className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setEditingTrigger(isEditing ? null : trigger.id)}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              title="Edit trigger"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => deleteTrigger(trigger.id)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Delete trigger"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {/* Data Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data Source</label>
              <select
                value={trigger.data_source}
                onChange={(e) => updateTrigger(trigger.id, { 
                  data_source: e.target.value,
                  condition: { ...trigger.condition, field: conditionFields[e.target.value as keyof typeof conditionFields][0].value }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                {dataSourceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Condition Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Field</label>
                <select
                  value={trigger.condition.field}
                  onChange={(e) => updateTrigger(trigger.id, {
                    condition: { ...trigger.condition, field: e.target.value }
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {conditionFields[trigger.data_source as keyof typeof conditionFields]?.map(field => (
                    <option key={field.value} value={field.value}>{field.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Operator</label>
                <select
                  value={trigger.condition.operator}
                  onChange={(e) => updateTrigger(trigger.id, {
                    condition: { ...trigger.condition, operator: e.target.value as 'greater_than' | 'less_than' | 'equals' | 'between' }
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Value Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Value</label>
              {trigger.condition.operator === 'between' ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={Array.isArray(trigger.condition.value) ? trigger.condition.value[0] : 0}
                    onChange={(e) => updateTrigger(trigger.id, {
                      condition: { 
                        ...trigger.condition, 
                        value: [parseFloat(e.target.value), Array.isArray(trigger.condition.value) ? trigger.condition.value[1] : 0]
                      }
                    })}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    value={Array.isArray(trigger.condition.value) ? trigger.condition.value[1] : 0}
                    onChange={(e) => updateTrigger(trigger.id, {
                      condition: { 
                        ...trigger.condition, 
                        value: [Array.isArray(trigger.condition.value) ? trigger.condition.value[0] : 0, parseFloat(e.target.value)]
                      }
                    })}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              ) : (
                <input
                  type="number"
                  value={Array.isArray(trigger.condition.value) ? trigger.condition.value[0] : trigger.condition.value}
                  onChange={(e) => updateTrigger(trigger.id, {
                    condition: { ...trigger.condition, value: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              )}
            </div>

            {/* Action Configuration */}
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Then Change</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property</label>
                  <select
                    value={trigger.action.property}
                    onChange={(e) => updateTrigger(trigger.id, {
                      action: { property: e.target.value as 'color_scheme' | 'animation_speed' | 'opacity', value: actionProperties.find(p => p.value === e.target.value)?.options?.[0].value || 1 }
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    {actionProperties.map(prop => (
                      <option key={prop.value} value={prop.value}>{prop.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Value</label>
                  {actionProperties.find(p => p.value === trigger.action.property)?.options ? (
                    <select
                      value={trigger.action.value}
                      onChange={(e) => updateTrigger(trigger.id, {
                        action: { ...trigger.action, value: e.target.value }
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      {actionProperties.find(p => p.value === trigger.action.property)?.options?.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      step="0.1"
                      min={actionProperties.find(p => p.value === trigger.action.property)?.range?.[0]}
                      max={actionProperties.find(p => p.value === trigger.action.property)?.range?.[1]}
                      value={trigger.action.value}
                      onChange={(e) => updateTrigger(trigger.id, {
                        action: { ...trigger.action, value: parseFloat(e.target.value) }
                      })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-purple-400 font-medium mb-1">Condition</div>
              <div className="text-white">{getConditionDescription(trigger)}</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-blue-400 font-medium mb-1">Action</div>
              <div className="text-white">{getActionDescription(trigger)}</div>
            </div>
          </div>
        )}

        {isPreviewing && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="text-blue-400 font-medium mb-2">Preview Active</div>
            <div className="text-sm text-gray-300">
              This trigger would activate when the condition is met, transforming your NFT in real-time.
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Data Triggers</h2>
          <p className="text-gray-400">Configure how your NFT transforms based on real-world data</p>
        </div>
        
        <button
          onClick={() => setIsAddingTrigger(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Trigger
        </button>
      </div>

      {/* Triggers List */}
      {triggers.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-600">
          <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Triggers Yet</h3>
          <p className="text-gray-400 mb-6">
            Add your first trigger to make your NFT respond to real-world data
          </p>
          <button
            onClick={addTrigger}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Create First Trigger
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {triggers.map(renderTriggerCard)}
        </div>
      )}

      {/* Add Trigger Modal */}
      {isAddingTrigger && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add New Trigger</h3>
            <p className="text-gray-400 mb-6">
              Triggers make your NFT dynamic by responding to real-world data changes.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={addTrigger}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create Trigger
              </button>
              <button
                onClick={() => setIsAddingTrigger(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {triggers.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Trigger Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{triggers.length}</div>
              <div className="text-sm text-gray-400">Total Triggers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{triggers.filter(t => t.is_active).length}</div>
              <div className="text-sm text-gray-400">Active Triggers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {new Set(triggers.map(t => t.data_source)).size}
              </div>
              <div className="text-sm text-gray-400">Data Sources</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerBuilder;