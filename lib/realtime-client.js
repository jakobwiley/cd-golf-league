/**
 * Realtime Client
 * 
 * This module provides a unified interface for realtime updates,
 * with automatic fallback from WebSockets to polling when WebSockets
 * are not available or supported in the environment.
 */

class RealtimeClient {
  constructor(baseUrl, path, queryParams = {}) {
    this.baseUrl = baseUrl || '';
    this.path = path;
    this.queryParams = queryParams;
    this.wsUrl = this._buildWsUrl();
    this.restUrl = this._buildRestUrl();
    this.ws = null;
    this.pollingInterval = null;
    this.pollingDelay = 5000; // 5 seconds between polls
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds between reconnect attempts
    this.listeners = [];
    this.connected = false;
    this.usePolling = false;
    this.lastPollTime = 0;
    this.lastPollData = null;
  }

  /**
   * Build WebSocket URL with query parameters
   */
  _buildWsUrl() {
    const wsBase = this.baseUrl.replace(/^http/, 'ws');
    const url = new URL(`${wsBase}${this.path}`);
    
    // Add query parameters
    Object.keys(this.queryParams).forEach(key => {
      url.searchParams.append(key, this.queryParams[key]);
    });
    
    return url.toString();
  }

  /**
   * Build REST API URL with query parameters
   */
  _buildRestUrl() {
    const url = new URL(`${this.baseUrl}${this.path.replace('/ws', '')}`);
    
    // Add query parameters
    Object.keys(this.queryParams).forEach(key => {
      url.searchParams.append(key, this.queryParams[key]);
    });
    
    return url.toString();
  }

  /**
   * Connect to the realtime service, trying WebSocket first
   * and falling back to polling if WebSockets fail
   */
  connect() {
    if (this.connected) return;

    console.log('Connecting to realtime service...');
    
    try {
      // Try WebSocket first
      this._connectWebSocket();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this._fallbackToPolling();
    }
  }

  /**
   * Attempt to connect via WebSocket
   */
  _connectWebSocket() {
    try {
      console.log(`Connecting to WebSocket: ${this.wsUrl}`);
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.connected = true;
        this.usePolling = false;
        this.reconnectAttempts = 0;
        this._notifyListeners({ type: 'connection', status: 'connected', transport: 'websocket' });
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this._notifyListeners(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (!this.connected) {
          this._fallbackToPolling();
        }
      };
      
      this.ws.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.connected = false;
        
        // Try to reconnect if this wasn't a clean close
        if (event.code !== 1000 && event.code !== 1001) {
          this._attemptReconnect();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this._fallbackToPolling();
    }
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  _attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached, falling back to polling');
      this._fallbackToPolling();
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      if (!this.connected && !this.usePolling) {
        this._connectWebSocket();
      }
    }, this.reconnectDelay);
  }

  /**
   * Fall back to polling when WebSockets are not available
   */
  _fallbackToPolling() {
    if (this.usePolling) return;
    
    console.log('Falling back to polling mechanism');
    this.usePolling = true;
    this.connected = true;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this._notifyListeners({ type: 'connection', status: 'connected', transport: 'polling' });
    this._startPolling();
  }

  /**
   * Start polling the REST API for updates
   */
  _startPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    // Immediately poll once
    this._poll();
    
    // Then set up regular polling
    this.pollingInterval = setInterval(() => {
      this._poll();
    }, this.pollingDelay);
  }

  /**
   * Poll the REST API for updates
   */
  async _poll() {
    try {
      const response = await fetch(this.restUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Only notify if data has changed
      if (JSON.stringify(data) !== JSON.stringify(this.lastPollData)) {
        this.lastPollData = data;
        this._notifyListeners({ 
          type: 'update', 
          data, 
          timestamp: new Date().toISOString(),
          transport: 'polling'
        });
      }
      
      this.lastPollTime = Date.now();
    } catch (error) {
      console.error('Polling error:', error);
    }
  }

  /**
   * Send a message to the server
   */
  send(message) {
    if (!this.connected) {
      console.error('Cannot send message: not connected');
      return false;
    }
    
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }
    
    if (this.usePolling) {
      // For polling, we use a POST request to send data
      fetch(this.restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: message,
      }).catch(error => {
        console.error('Error sending message via HTTP:', error);
      });
    } else if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // For WebSockets, we send directly
      this.ws.send(message);
    } else {
      console.error('Cannot send message: WebSocket not open');
      return false;
    }
    
    return true;
  }

  /**
   * Add a listener for realtime updates
   */
  addListener(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Listener must be a function');
    }
    
    this.listeners.push(callback);
    return this.listeners.length - 1; // Return index for removal
  }

  /**
   * Remove a listener
   */
  removeListener(index) {
    if (index >= 0 && index < this.listeners.length) {
      this.listeners.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Notify all listeners of an update
   */
  _notifyListeners(data) {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  /**
   * Disconnect from the realtime service
   */
  disconnect() {
    console.log('Disconnecting from realtime service');
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    this.connected = false;
    this.usePolling = false;
    this._notifyListeners({ type: 'connection', status: 'disconnected' });
  }
}

// Export for use in browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RealtimeClient };
} else {
  window.RealtimeClient = RealtimeClient;
}
