import React, { useReducer } from 'react';
import { Plus, Trash2, ArrowRight, Code, Database, Route } from 'lucide-react';
import { generateFullSchema, generateRoutes, generateModels } from '../../utils/index.js';

// Utility functions (KEEP these - they're used in the UI)
const toSnakeCase = (str) => {
  if (!str) return '';
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
};

const pluralize = (word) => {
  if (!word) return '';
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.slice(-2, -1).toLowerCase())) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  }
  return word + 's';
};

const initialState = {
  step: 1,
  projectName: '',
  entities: [{ name: '', fields: [] }],
  currentEntityIndex: 0,
  relationships: [],
  generatedCode: { models: '', schemas: '', routes: '' },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_PROJECT_NAME':
      return { ...state, projectName: action.payload };
    case 'ADD_ENTITY':
      return { ...state, entities: [...state.entities, { name: '', fields: [] }] };
    case 'REMOVE_ENTITY':
      if (state.entities.length <= 1) return state;
      return { ...state, entities: state.entities.filter((_, i) => i !== action.payload) };
    case 'UPDATE_ENTITY_NAME':
      const cleanName = action.payload.name
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z]/g, '')
        .replace(/^\w/, c => c.toUpperCase());
      return { ...state, entities: state.entities.map((e, i) => 
        i === action.payload.index ? { ...e, name: cleanName } : e
      ) };
    case 'SET_CURRENT_ENTITY_INDEX':
      return { ...state, currentEntityIndex: action.payload };
    case 'ADD_FIELD': {
      const newEntities = [...state.entities];
      newEntities[action.payload].fields.push({ name: '', type: 'String' });
      return { ...state, entities: newEntities };
    }
    case 'REMOVE_FIELD': {
      const newEntities = [...state.entities];
      newEntities[action.payload.entityIndex].fields = newEntities[action.payload.entityIndex].fields.filter((_, i) => i !== action.payload.fieldIndex);
      return { ...state, entities: newEntities };
    }
    case 'UPDATE_FIELD': {
      const newEntities = [...state.entities];
      newEntities[action.payload.entityIndex].fields[action.payload.fieldIndex][action.payload.key] = action.payload.value;
      return { ...state, entities: newEntities };
    }
    case 'SET_RELATIONSHIPS':
      return { ...state, relationships: action.payload };
    case 'UPDATE_RELATIONSHIP':
      return { 
        ...state, 
        relationships: state.relationships.map((r, i) => 
          i === action.payload.index 
            ? action.payload.key === 'multiple'
              ? { ...r, ...action.payload.value }
              : { ...r, [action.payload.key]: action.payload.value }
            : r
        ) 
      };
    case 'SET_GENERATED_CODE':
      return { ...state, generatedCode: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error();
  }
}

// ✅ NEW: Using utils hub - super simple!
const handleGenerateCode = (entities, relationships, projectName, dispatch) => {
  const { models, schemas } = generateFullSchema(entities, relationships, projectName);
  const routes = generateRoutes(entities, relationships, projectName);
  
  dispatch({ 
    type: 'SET_GENERATED_CODE', 
    payload: { models, schemas, routes }
  });
  dispatch({ type: 'SET_STEP', payload: 4 });
};

function getRelationshipOptions(entity1, entity2) {
  return [
    {
      value: 'none',
      label: `No direct relationship (they may connect through other tables)`,
      config: { entity1HasMany: false, entity2HasMany: false, skipRelationship: true }
    },
    {
      value: 'entity1-to-entity2',
      label: `${entity1} belongs to ONE ${entity2} (adds ${toSnakeCase(entity2)}_id to ${entity1})`,
      config: { entity1HasMany: false, entity2HasMany: true }
    },
    {
      value: 'entity2-to-entity1',
      label: `${entity2} belongs to ONE ${entity1} (adds ${toSnakeCase(entity1)}_id to ${entity2})`,
      config: { entity1HasMany: true, entity2HasMany: false }
    },
    {
      value: 'many-to-many',
      label: `Many-to-Many: ${pluralize(entity1)} ↔ ${pluralize(entity2)} (creates bridge table)`,
      config: { entity1HasMany: true, entity2HasMany: true }
    }
  ];
}

function FullSchemaGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, projectName, entities, currentEntityIndex, relationships, generatedCode } = state;

  const askRelationships = () => {
    const rels = [];
    const validEntities = entities.filter(e => e.name);
    for (let i = 0; i < validEntities.length; i++) {
      for (let j = i + 1; j < validEntities.length; j++) {
        rels.push({
          entity1: validEntities[i].name,
          entity2: validEntities[j].name,
          entity1HasMany: null,
          entity2HasMany: null
        });
      }
    }
    dispatch({ type: 'SET_RELATIONSHIPS', payload: rels });
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  // ✅ UPDATED: Now uses utils!
  const generateCode = () => {
    handleGenerateCode(entities, relationships, projectName, dispatch);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
              <Database className="w-10 h-10 text-indigo-600" />
              Complete Backend Generator
            </h1>
            <p className="text-gray-600">Generate Models, Schemas, and API Routes</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1,2,3,4].map(num => (
                <React.Fragment key={num}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{num}</div>
                  {num < 4 && <ArrowRight className="w-5 h-5 text-gray-400" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* STEP 1: Project & Entities */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1: Define Your Tables</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={(e) => dispatch({ type: 'SET_PROJECT_NAME', payload: e.target.value })} 
                  placeholder="e.g., Music Tracker" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none" 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Tables</label>
                {entities.map((entity, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={entity.name} 
                      onChange={(e) => dispatch({ type: 'UPDATE_ENTITY_NAME', payload: { index, name: e.target.value } })} 
                      placeholder="Entity name" 
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg" 
                    />
                    {entities.length > 1 && (
                      <button 
                        onClick={() => dispatch({ type: 'REMOVE_ENTITY', payload: index })} 
                        className="px-4 text-red-500 hover:bg-red-50 rounded-lg p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={() => dispatch({ type: 'ADD_ENTITY' })} 
                  className="flex items-center gap-2 text-indigo-600 font-semibold mt-2 hover:text-indigo-700"
                >
                  <Plus className="w-5 h-5" /> Add Table
                </button>
              </div>
              <button 
              onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })} 
              disabled={!projectName || entities.filter(e => e.name).length < 2}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* STEP 2: Fields */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Add Fields</h2>
              <div className="flex gap-2 mb-6 flex-wrap">
                {entities.filter(e => e.name).map((entity, index) => (
                  <button 
                    key={index} 
                    onClick={() => dispatch({ type: 'SET_CURRENT_ENTITY_INDEX', payload: index })} 
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentEntityIndex === index 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {entity.name}
                  </button>
                ))}
              </div>
              {entities[currentEntityIndex] && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-4">{entities[currentEntityIndex].name} Fields</h3>
                  {entities[currentEntityIndex].fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex gap-2 mb-3 items-end">
                      <input 
                        type="text" 
                        value={field.name} 
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { entityIndex: currentEntityIndex, fieldIndex, key: 'name', value: e.target.value } })} 
                        placeholder="Field name" 
                        className="flex-1 px-3 py-2 border rounded-lg focus:border-indigo-500 focus:outline-none" 
                      />
                      <select 
                        value={field.type} 
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { entityIndex: currentEntityIndex, fieldIndex, key: 'type', value: e.target.value } })} 
                        className="px-3 py-2 border rounded-lg focus:border-indigo-500"
                      >
                        <option>String</option>
                        <option>Integer</option>
                        <option>Boolean</option>
                        <option>DateTime</option>
                      </select>
                      <button 
                        onClick={() => dispatch({ type: 'REMOVE_FIELD', payload: { entityIndex: currentEntityIndex, fieldIndex } })} 
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => dispatch({ type: 'ADD_FIELD', payload: currentEntityIndex })} 
                    className="flex items-center gap-2 text-indigo-600 font-semibold mt-4 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" /> Add Field
                  </button>
                </div>
              )}
              <div className="flex gap-4">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })} 
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button 
                  onClick={askRelationships} 
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700"
                >
                  Next → Relationships
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Relationships */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Define Relationships</h2>
              <p className="text-gray-600 mb-6">Choose how your tables relate to each other. Think about which table should store the foreign key.</p>
              
              {relationships.map((rel, index) => {
                const options = getRelationshipOptions(rel.entity1, rel.entity2);
                const selectedValue = 
                  rel.skipRelationship ? 'none' :
                  rel.entity1HasMany && rel.entity2HasMany ? 'many-to-many' :
                  !rel.entity1HasMany && rel.entity2HasMany ? 'entity1-to-entity2' :
                  rel.entity1HasMany && !rel.entity2HasMany ? 'entity2-to-entity1' :
                  null;
                
                return (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border-2 border-indigo-200">
                    <h3 className="font-bold text-xl mb-4 text-indigo-900">
                      {rel.entity1} ↔ {rel.entity2}
                    </h3>
                    
                    <div className="space-y-3">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            dispatch({ 
                              type: 'UPDATE_RELATIONSHIP', 
                              payload: { 
                                index, 
                                key: 'multiple',
                                value: option.config
                              }
                            });
                          }}
                          className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all ${
                            selectedValue === option.value
                              ? 'bg-green-100 border-green-500 text-green-900 shadow-md'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:bg-indigo-25'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Show example */}
                    {selectedValue && selectedValue !== 'none' && (
                      <div className="mt-4 p-3 bg-white rounded border border-indigo-200">
                        <p className="text-sm text-gray-600 font-mono">
                          {selectedValue === 'entity1-to-entity2' && `${rel.entity1}.${toSnakeCase(rel.entity2)}_id → ${rel.entity2}.id`}
                          {selectedValue === 'entity2-to-entity1' && `${rel.entity2}.${toSnakeCase(rel.entity1)}_id → ${rel.entity1}.id`}
                          {selectedValue === 'many-to-many' && `${toSnakeCase(rel.entity1)}_${toSnakeCase(pluralize(rel.entity2))} bridge table`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="flex gap-4">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })} 
                  className="px-6 py-3 border-2 rounded-lg font-semibold hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button 
                  onClick={generateCode} 
                  disabled={relationships.some(r => !r.skipRelationship && (r.entity1HasMany === null || r.entity2HasMany === null))}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700"
                >
                  Generate Code →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Generated Code */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code className="w-8 h-8 text-green-600" />
                Your Backend is Ready! 🚀
              </h2>
              
              <div className="space-y-6">
                {/* Models */}
                <div className="bg-gray-900 text-green-400 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-2">
                    <h3 className="text-white font-bold">📁 app/models.py</h3>
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedCode.models)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-medium transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap font-mono">{generatedCode.models}</pre>
                </div>

                {/* Schemas */}
                <div className="bg-gray-900 text-blue-400 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-2">
                    <h3 className="text-white font-bold">📁 app/schemas.py</h3>
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedCode.schemas)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap font-mono">{generatedCode.schemas}</pre>
                </div>

                {/* Routes */}
                <div className="bg-gray-900 text-purple-400 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-2">
                    <h3 className="text-white font-bold">📁 app/routes.py</h3>
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedCode.routes)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-xs font-medium transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap font-mono">{generatedCode.routes}</pre>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  🚀 Next Steps:
                </h3>
                <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                  <li>Copy the 3 files to your Flask project</li>
                  <li><code>pip install flask flask-sqlalchemy flask-marshmallow marshmallow-sqlalchemy</code></li>
                  <li><code>python init_db.py</code> (create this file)</li>
                  <li><code>python run.py</code></li>
                  <li>Test: <code>curl http://localhost:5555/api/health</code></li>
                </ol>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })} 
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
                >
                  ← Edit Project
                </button>
                <button 
                  onClick={() => dispatch({ type: 'RESET' })} 
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700"
                >
                  🔄 New Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FullSchemaGenerator;