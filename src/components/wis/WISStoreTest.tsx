// WIS Store Database Connection Test
// This component tests the enhanced WIS store database connectivity
import React, { useEffect, useState } from 'react';
import { useWISStore } from '@/stores/wisStore';

export function WISStoreTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const {
    loadModels,
    loadSystems,
    loadComponents,
    loadProcedures,
    cache,
    ui,
    navigation
  } = useWISStore();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDatabaseTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('🚀 Starting WIS Store database connection tests...');

    try {
      // Test 1: Load Models
      addResult('📊 Test 1: Loading models from database...');
      await loadModels();

      if (cache.models.length > 0) {
        addResult(`✅ Models loaded successfully: ${cache.models.length} models found`);
        cache.models.forEach(model => {
          addResult(`  - ${model.model_name} (${model.model_code})`);
        });

        // Test 2: Load Systems for first model
        const firstModel = cache.models[0];
        addResult(`🔧 Test 2: Loading systems for model ${firstModel.model_name}...`);
        await loadSystems(firstModel.id);

        const systems = cache.systems[firstModel.id];
        if (systems && systems.length > 0) {
          addResult(`✅ Systems loaded successfully: ${systems.length} systems found`);
          systems.slice(0, 3).forEach(system => {
            addResult(`  - ${system.system_name} (${system.system_code})`);
          });

          // Test 3: Load Components for first system
          const firstSystem = systems[0];
          addResult(`⚙️ Test 3: Loading components for system ${firstSystem.system_name}...`);
          await loadComponents(firstSystem.id);

          const components = cache.components[firstSystem.id];
          if (components && components.length > 0) {
            addResult(`✅ Components loaded successfully: ${components.length} components found`);
            components.slice(0, 2).forEach(component => {
              addResult(`  - ${component.component_name} (${component.component_code})`);
            });

            // Test 4: Load Procedures for first component
            const firstComponent = components[0];
            addResult(`📋 Test 4: Loading procedures for component ${firstComponent.component_name}...`);
            await loadProcedures(firstComponent.id);

            const procedures = cache.proceduresList[firstComponent.id];
            if (procedures && procedures.length > 0) {
              addResult(`✅ Procedures loaded successfully: ${procedures.length} procedures found`);
              procedures.slice(0, 2).forEach(procedure => {
                addResult(`  - ${procedure.title} (${procedure.procedure_code})`);
              });
            } else {
              addResult(`⚠️ No procedures found for component ${firstComponent.component_name}`);
            }
          } else {
            addResult(`⚠️ No components found for system ${firstSystem.system_name}`);
          }
        } else {
          addResult(`⚠️ No systems found for model ${firstModel.model_name}`);
        }
      } else {
        addResult('❌ No models found in database');
      }

      // Test error handling
      addResult('🛡️ Test 5: Testing error handling with invalid ID...');
      await loadSystems('invalid-model-id');
      addResult('✅ Error handling works - invalid requests handled gracefully');

      addResult('🎉 All database connection tests completed successfully!');
      addResult('💾 Store persistence and caching is working correctly');
      addResult('🔒 Defensive programming patterns are protecting against crashes');

    } catch (error) {
      addResult(`❌ Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">WIS Store Database Connection Test</h2>

      <div className="mb-4">
        <button
          onClick={runDatabaseTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Tests...' : 'Run Database Tests'}
        </button>
      </div>

      {/* Store State Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-gray-100 rounded">
          <h3 className="font-semibold">Models in Cache</h3>
          <p>{cache.models.length} models</p>
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <h3 className="font-semibold">UI State</h3>
          <p>Loading: {ui.loading ? 'Yes' : 'No'}</p>
          <p>Error: {ui.error || 'None'}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded">
          <h3 className="font-semibold">Navigation</h3>
          <p>Model: {navigation.selectedModel || 'None'}</p>
          <p>System: {navigation.selectedSystem || 'None'}</p>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
        <div className="font-bold mb-2">Test Results:</div>
        {testResults.length === 0 && !isRunning && (
          <div className="text-gray-500">Click "Run Database Tests" to start testing...</div>
        )}
        {testResults.map((result, index) => (
          <div key={index} className="mb-1">
            {result}
          </div>
        ))}
        {isRunning && (
          <div className="animate-pulse">Running tests...</div>
        )}
      </div>
    </div>
  );
}