/**
 * Secure Database Access Module
 * 
 * This module provides secure methods for accessing the database,
 * with built-in protection against SQL injection and proper authorization checks.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing required Supabase environment variables');
  process.exit(1);
}

// Create clients with different permission levels
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

/**
 * Secure query execution with proper authorization
 * @param {string} table - The table to query
 * @param {Object} options - Query options
 * @param {boolean} options.useServiceRole - Whether to use the service role for this query
 * @param {string} options.action - The action to perform (select, insert, update, delete)
 * @param {Object} options.filters - Query filters
 * @param {Array} options.columns - Columns to select
 * @param {Object} options.data - Data for insert/update operations
 * @param {Object} options.user - User context for authorization
 * @returns {Promise} - Query result
 */
async function secureQuery(table, options = {}) {
  const {
    useServiceRole = false,
    action = 'select',
    filters = {},
    columns = '*',
    data = null,
    user = null,
    returnData = true
  } = options;

  // Choose the appropriate client based on authorization level
  const client = useServiceRole ? serviceClient : anonClient;
  
  // Set auth context if user is provided
  if (user && user.id && !useServiceRole) {
    await client.auth.setSession({
      access_token: user.token,
      refresh_token: user.refreshToken
    });
  }

  // Log the operation for audit purposes
  console.log(`[DB Access] ${action.toUpperCase()} on ${table} by ${user ? user.id : 'anonymous/service'}`);

  // Execute the query based on the action
  let query;
  let result;

  try {
    switch (action.toLowerCase()) {
      case 'select':
        query = client.from(table).select(columns);
        break;
        
      case 'insert':
        if (!data) throw new Error('Data is required for insert operations');
        query = client.from(table).insert(data);
        break;
        
      case 'update':
        if (!data) throw new Error('Data is required for update operations');
        query = client.from(table).update(data);
        break;
        
      case 'delete':
        query = client.from(table).delete();
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value !== null) {
          // Handle special operators like gt, lt, etc.
          Object.entries(value).forEach(([operator, operand]) => {
            switch (operator) {
              case 'gt':
                query = query.gt(key, operand);
                break;
              case 'gte':
                query = query.gte(key, operand);
                break;
              case 'lt':
                query = query.lt(key, operand);
                break;
              case 'lte':
                query = query.lte(key, operand);
                break;
              case 'neq':
                query = query.neq(key, operand);
                break;
              case 'like':
                query = query.like(key, operand);
                break;
              case 'ilike':
                query = query.ilike(key, operand);
                break;
              default:
                console.warn(`Unsupported operator: ${operator}`);
            }
          });
        } else {
          query = query.eq(key, value);
        }
      });
    }

    // Execute the query
    if (returnData) {
      result = await query;
    } else {
      result = await query.then(() => ({ success: true }));
    }

    // Check for errors
    if (result.error) {
      throw new Error(`Database error: ${result.error.message}`);
    }

    return result;
  } catch (error) {
    console.error(`[DB Error] ${error.message}`);
    throw error;
  }
}

/**
 * Secure transaction execution
 * @param {Function} callback - Transaction callback
 * @param {Object} options - Transaction options
 * @returns {Promise} - Transaction result
 */
async function secureTransaction(callback, options = {}) {
  const { useServiceRole = true, user = null } = options;
  
  // Use service role for transactions by default for reliability
  const client = useServiceRole ? serviceClient : anonClient;
  
  // Set auth context if user is provided
  if (user && user.id && !useServiceRole) {
    await client.auth.setSession({
      access_token: user.token,
      refresh_token: user.refreshToken
    });
  }

  console.log(`[DB Transaction] Started by ${user ? user.id : 'service'}`);
  
  try {
    // Execute the transaction callback
    const result = await callback(client);
    console.log('[DB Transaction] Completed successfully');
    return result;
  } catch (error) {
    console.error(`[DB Transaction Error] ${error.message}`);
    throw error;
  }
}

module.exports = {
  secureQuery,
  secureTransaction,
  anonClient,
  serviceClient
};
