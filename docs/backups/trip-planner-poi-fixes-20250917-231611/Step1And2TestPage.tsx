import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, MapPin, Navigation } from 'lucide-react';
import TripPlanner from './TripPlanner';

/**
 * STEP 1 & 2 TEST PAGE
 * Use this component to test the fixes for:
 * - Step 1: Blue dot current position visibility
 * - Step 2: Waypoint labels (A, B, C) visibility
 */

const Step1And2TestPage: React.FC = () => {
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [testResults, setTestResults] = useState({
    blueDot: null as boolean | null,
    waypointLabels: null as boolean | null
  });

  const handleOpenTripPlanner = () => {
    setShowTripPlanner(true);
    console.log('🧪 STEP 1 & 2 TEST: Opening trip planner...');
    console.log('🔍 Watch console for:');
    console.log('  - "STEP 1 SUCCESS: User location found!" for blue dot');
    console.log('  - "STEP 2: Enhanced ORIGIN/DESTINATION marker created" for labels');
  };

  const handleCloseTripPlanner = () => {
    setShowTripPlanner(false);
  };

  const recordBlueDotResult = (success: boolean) => {
    setTestResults(prev => ({ ...prev, blueDot: success }));
    console.log(`🧪 BLUE DOT TEST RESULT: ${success ? 'SUCCESS' : 'FAILED'}`);
  };

  const recordLabelResult = (success: boolean) => {
    setTestResults(prev => ({ ...prev, waypointLabels: success }));
    console.log(`🧪 WAYPOINT LABEL TEST RESULT: ${success ? 'SUCCESS' : 'FAILED'}`);
  };

  const TestResultIndicator = ({ result, testName }: { result: boolean | null; testName: string }) => {
    if (result === null) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>{testName}: Not tested yet</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${result ? 'text-green-600' : 'text-red-600'}`}>
        <CheckCircle className="w-4 h-4" />
        <span>{testName}: {result ? 'SUCCESS' : 'FAILED'}</span>
      </div>
    );
  };

  if (showTripPlanner) {
    return (
      <div className="container mx-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>🧪 Step 1 & 2 Testing in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Testing Instructions:</strong>
                <ol className="list-decimal ml-4 mt-2">
                  <li><strong>Step 1 - Blue Dot Test:</strong> Look for a blue dot on the map showing your current location. Check browser console for geolocation messages.</li>
                  <li><strong>Step 2 - Label Test:</strong> Click "Add Waypoints A-B" button, then click on the map. You should see markers with clear "A", "B" labels.</li>
                  <li>Check the browser console for detailed logging of both features.</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => recordBlueDotResult(true)}
                variant="outline"
                className="text-green-600"
              >
                ✅ Blue Dot Visible
              </Button>
              <Button
                onClick={() => recordBlueDotResult(false)}
                variant="outline"
                className="text-red-600"
              >
                ❌ Blue Dot Missing
              </Button>
              <Button
                onClick={() => recordLabelResult(true)}
                variant="outline"
                className="text-green-600"
              >
                ✅ Labels Visible
              </Button>
              <Button
                onClick={() => recordLabelResult(false)}
                variant="outline"
                className="text-red-600"
              >
                ❌ Labels Missing
              </Button>
            </div>

            <div className="mb-4 space-y-2">
              <TestResultIndicator result={testResults.blueDot} testName="Blue Dot (Step 1)" />
              <TestResultIndicator result={testResults.waypointLabels} testName="Waypoint Labels (Step 2)" />
            </div>

            <Button onClick={handleCloseTripPlanner} variant="secondary" className="mb-4">
              ← Back to Test Setup
            </Button>
          </CardContent>
        </Card>

        <TripPlanner onClose={handleCloseTripPlanner} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Step 1 & 2 Test Page - Trip Planner Fixes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <Navigation className="w-4 h-4" />
              <AlertDescription>
                <strong>What we're testing:</strong>
                <ul className="list-disc ml-4 mt-2">
                  <li><strong>Step 1:</strong> Blue dot showing current GPS position on map</li>
                  <li><strong>Step 2:</strong> Waypoint markers displaying clear A, B, C labels</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔧 Fixes Applied:</h3>
              <div className="space-y-2 text-sm">
                <div>✅ <strong>Enhanced GeolocateControl</strong> - Better timeout, auto-trigger, user feedback</div>
                <div>✅ <strong>Improved marker styling</strong> - Larger size, better contrast, z-index fixes</div>
                <div>✅ <strong>Enhanced label visibility</strong> - Text shadows, better fonts, positioning</div>
                <div>✅ <strong>Console debugging</strong> - Detailed logging for troubleshooting</div>
                <div>✅ <strong>Custom CSS styles</strong> - Dedicated stylesheet for marker appearance</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📝 Testing Steps:</h3>
              <ol className="list-decimal ml-4 space-y-1 text-sm">
                <li>Click "Open Trip Planner" to start testing</li>
                <li>Allow location permission when prompted (for Step 1)</li>
                <li>Look for blue dot on map indicating your position</li>
                <li>Click "Add Waypoints A-B" button to enable waypoint mode</li>
                <li>Click on the map to add waypoints and verify A, B labels are visible</li>
                <li>Check browser console (F12) for detailed logging</li>
                <li>Use the result buttons to record your test outcomes</li>
              </ol>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleOpenTripPlanner}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                🧪 Open Trip Planner for Testing
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>This test page will be removed after confirming fixes work correctly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step1And2TestPage;