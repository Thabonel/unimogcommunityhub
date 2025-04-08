
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CodeBlock } from '@/components/ui/code-block';

interface BotpressInstructionsProps {
  webhookUrl: string;
}

const BotpressInstructions: React.FC<BotpressInstructionsProps> = ({ webhookUrl }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>How to Configure Botpress</CardTitle>
        <CardDescription>
          Follow these steps to connect your Botpress chatbot with your map
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Step 1: Create a Card in Botpress</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">In your Botpress flow:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a new card or message to show trip details</li>
                <li>Include the trip title, description, start and end points</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Step 2: Add a "Send to Website" Button</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">In your card:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Add a button labeled "View on Map" or similar</li>
                <li>When clicked, this button will send the trip data to your website</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Step 3: Configure the HTTP Request</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">In Botpress flow, after the button is clicked:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Add an HTTP Request card</li>
                <li>Set the method to POST</li>
                <li>Set the URL to: <code className="bg-gray-100 px-2 py-1 rounded">{webhookUrl}</code></li>
                <li>Set the body to JSON containing your trip data</li>
              </ol>
              
              <div className="mt-4">
                <p className="font-semibold mb-2">Example JSON structure:</p>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  {`{
  "id": "{{$session.trip_id}}",
  "title": "{{$session.trip_title}}",
  "description": "{{$session.trip_description}}",
  "startLocation": "{{$session.start_location}}",
  "endLocation": "{{$session.end_location}}",
  "startCoordinates": [{{$session.start_lng}}, {{$session.start_lat}}],
  "endCoordinates": [{{$session.end_lng}}, {{$session.end_lat}}],
  "locations": [
    {
      "name": "Starting Point",
      "coordinates": [{{$session.start_lng}}, {{$session.start_lat}}],
      "type": "start"
    },
    {
      "name": "Campsite",
      "coordinates": [9.5, 48.2],
      "type": "campsite",
      "description": "Beautiful forest campsite"
    },
    {
      "name": "Destination",
      "coordinates": [{{$session.end_lng}}, {{$session.end_lat}}],
      "type": "end"
    }
  ]
}`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Alternative: Window Message Method</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                If HTTP requests don't work, you can use window.postMessage:
              </p>
              
              <ol className="list-decimal pl-5 space-y-2">
                <li>Add a JavaScript action in Botpress</li>
                <li>Use the code below to send data to the parent window</li>
              </ol>
              
              <div className="mt-4">
                <p className="font-semibold mb-2">Example JavaScript code:</p>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  {`// In Botpress JavaScript action
window.parent.postMessage({
  type: 'botpress-trip-data',
  tripData: {
    id: session.trip_id,
    title: session.trip_title,
    description: session.trip_description,
    startLocation: session.start_location,
    endLocation: session.end_location,
    startCoordinates: [session.start_lng, session.start_lat],
    endCoordinates: [session.end_lng, session.end_lat],
    locations: [
      {
        name: "Starting Point",
        coordinates: [session.start_lng, session.start_lat],
        type: "start"
      },
      // Add other locations as needed
      {
        name: "Destination",
        coordinates: [session.end_lng, session.end_lat],
        type: "end"
      }
    ]
  }
}, '*');`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BotpressInstructions;
