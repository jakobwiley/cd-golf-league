import { format, parseISO } from 'date-fns';

/**
 * Formats a date for display consistently
 */
export function formatDisplayDate(date: Date | string, formatString: string = 'MMM d, yyyy'): string {
  // If date is a string, convert to Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format the date
  return format(dateObj, formatString);
}

/**
 * Formats a date from the database for form input (YYYY-MM-DD)
 * Ensures the date displayed in the form matches what's in the database
 */
export function formatDateForForm(date: Date | string): string {
  // If date is a string, convert to Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format as YYYY-MM-DD
  return dateObj.toISOString().split('T')[0];
}

/**
 * Ensures consistent date format for API
 * This preserves the exact date selected by the user
 */
export function formatDateForAPI(dateString: string): string {
  console.log('Original date string:', dateString);
  
  // Parse the date string (YYYY-MM-DD) into parts
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create a new date with the same year, month, and day at noon UTC
  // This ensures we don't have timezone issues
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  console.log('Parsed date object:', date);
  console.log('ISO string:', date.toISOString());
  console.log('Local date string:', date.toLocaleDateString());
  
  // Return ISO string
  return date.toISOString();
} 