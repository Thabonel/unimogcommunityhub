import React from 'react';
import { ChevronDown, ChevronRight, FileText, Wrench, Clock } from 'lucide-react';

const WISMockup = () => {
  const [expandedSystems, setExpandedSystems] = React.useState<string[]>(['01']);

  const toggleSystem = (systemId: string) => {
    setExpandedSystems(prev =>
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
  };

  const mockSystems = [
    {
      id: '01',
      name: 'Engine',
      componentCount: 3,
      components: [
        {
          id: '01-01',
          name: 'Engine Block',
          procedures: [
            { id: 'proc-001', title: 'Engine Block Inspection', duration: '45 min', difficulty: 'Medium' },
            { id: 'proc-002', title: 'Engine Block Rebuild', duration: '4 hours', difficulty: 'Advanced' }
          ]
        },
        {
          id: '01-02',
          name: 'Fuel System',
          procedures: [
            { id: 'proc-003', title: 'Fuel Pump Replacement', duration: '2 hours', difficulty: 'Medium' }
          ]
        },
        {
          id: '01-03',
          name: 'Cooling System',
          procedures: [
            { id: 'proc-004', title: 'Radiator Service', duration: '1.5 hours', difficulty: 'Easy' }
          ]
        }
      ]
    },
    {
      id: '02',
      name: 'Transmission',
      componentCount: 2,
      components: [
        {
          id: '02-01',
          name: 'Manual Transmission',
          procedures: [
            { id: 'proc-005', title: 'Transmission Oil Change', duration: '1 hour', difficulty: 'Easy' }
          ]
        },
        {
          id: '02-02',
          name: 'Transfer Case',
          procedures: [
            { id: 'proc-006', title: 'Transfer Case Service', duration: '2 hours', difficulty: 'Medium' }
          ]
        }
      ]
    },
    {
      id: '03',
      name: 'Axles & Differential',
      componentCount: 2,
      components: [
        {
          id: '03-01',
          name: 'Front Axle',
          procedures: [
            { id: 'proc-007', title: 'Front Axle Service', duration: '3 hours', difficulty: 'Advanced' }
          ]
        },
        {
          id: '03-02',
          name: 'Rear Axle',
          procedures: [
            { id: 'proc-008', title: 'Rear Axle Service', duration: '3 hours', difficulty: 'Advanced' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Mercedes WIS - Unimog U1700L</h2>
        <p className="text-sm text-gray-600">Workshop Information System (Demonstration Mode)</p>
      </div>

      {/* Systems Tree */}
      <div className="p-4">
        <div className="space-y-2">
          {mockSystems.map((system) => (
            <div key={system.id} className="border border-gray-200 rounded-lg">
              {/* System Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSystem(system.id)}
              >
                <div className="flex items-center gap-2">
                  {expandedSystems.includes(system.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{system.name}</span>
                </div>
                <span className="text-sm text-gray-500">{system.componentCount} components</span>
              </div>

              {/* System Components */}
              {expandedSystems.includes(system.id) && (
                <div className="border-t border-gray-200">
                  {system.components.map((component) => (
                    <div key={component.id} className="p-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-800">{component.name}</span>
                      </div>

                      {/* Procedures */}
                      <div className="ml-6 space-y-1">
                        {component.procedures.map((procedure) => (
                          <div key={procedure.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-700">{procedure.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{procedure.duration}</span>
                              <span className={`px-2 py-1 rounded ${
                                procedure.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                procedure.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {procedure.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 border-t bg-blue-50">
        <div className="text-center">
          <p className="text-sm text-blue-800 font-medium">🎭 WIS Demonstration Mode</p>
          <p className="text-xs text-blue-600 mt-1">
            This is a mockup showing how the full Mercedes WIS system will work.
            Real functionality will be available when we reach 15 Premium members or 1 Lifetime member.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WISMockup;