/**
 * RealtimeWrapper Component
 * 
 * This component provides a wrapper for realtime functionality with automatic
 * fallback from WebSockets to polling when WebSockets are not available.
 */

'use client';

import React, { useEffect, useState, useCallback, Children } from 'react';

// We'll import the client directly since we're using client-side only rendering
let RealtimeClient: any = null;

// Only import on the client side
if (typeof window !== 'undefined') {
  import('../../lib/realtime-client').then((module) => {
    RealtimeClient = module.RealtimeClient;
  });
}

interface RealtimeWrapperProps {
  path: string;
  queryParams?: Record<string, string>;
  onUpdate: (data: any) => void;
  children: React.ReactNode;
}

const RealtimeWrapper: React.FC<RealtimeWrapperProps> = ({ 
  path, 
  queryParams = {}, 
  onUpdate,
  children 
}) => {
  const [client, setClient] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [transportType, setTransportType] = useState<string>('none');

  // Initialize the realtime client
  useEffect(() => {
    if (typeof window === 'undefined' || !RealtimeClient) return;

    const baseUrl = window.location.origin;
    const realtimeClient = new RealtimeClient(baseUrl, path, queryParams);
    
    setClient(realtimeClient);

    // Connect to the realtime service
    realtimeClient.connect();

    // Clean up on unmount
    return () => {
      if (realtimeClient) {
        realtimeClient.disconnect();
      }
    };
  }, [path, JSON.stringify(queryParams)]);

  // Set up the message listener
  useEffect(() => {
    if (!client) return;

    const handleMessage = (message: any) => {
      console.log('Realtime message received:', message);
      
      // Update connection status if this is a connection message
      if (message.type === 'connection') {
        setConnectionStatus(message.status);
        if (message.transport) {
          setTransportType(message.transport);
        }
      } else {
        // Forward other messages to the parent component
        onUpdate(message);
      }
    };

    const listenerId = client.addListener(handleMessage);

    return () => {
      if (client) {
        client.removeListener(listenerId);
      }
    };
  }, [client, onUpdate]);

  // Function to send a message
  const sendMessage = useCallback((message: any) => {
    if (client && client.connected) {
      return client.send(message);
    }
    return false;
  }, [client]);

  // Provide the connection status and send function to children
  const enhancedChildren = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        realtimeStatus: connectionStatus,
        realtimeTransport: transportType,
        sendRealtimeMessage: sendMessage
      });
    }
    return child;
  });

  return (
    <>
      {enhancedChildren}
      {connectionStatus !== 'connected' && (
        <div className="realtime-status-indicator">
          Connecting to realtime service...
        </div>
      )}
    </>
  );
};

export default RealtimeWrapper;
