// WISWelcomeScreen - Welcome screen when no procedure is selected
import React from 'react';
import { useWISNavigation } from '@/stores/wisStore';

interface WISWelcomeScreenProps {
  className?: string;
}

export const WISWelcomeScreen: React.FC<WISWelcomeScreenProps> = ({
  className,
}) => {
  const navigation = useWISNavigation();

  return (
    <div className={className}>
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">MB</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mercedes-Benz Workshop Information System
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Professional workshop procedures and technical information for Unimog vehicles
          </p>

          <div className="space-y-4">
            {!navigation.selectedModel ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Getting Started
                </h2>
                <p className="text-gray-600">
                  Select a vehicle model from the sidebar to access workshop procedures,
                  technical bulletins, and parts information.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Browse Procedures
                </h2>
                <p className="text-gray-600">
                  Navigate through the system hierarchy or use the search function to find
                  specific procedures, parts, or service bulletins.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">850+</div>
                <div className="text-sm text-gray-600">Procedures</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">Parts</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600">50+</div>
                <div className="text-sm text-gray-600">Bulletins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};