/**
 * Shared Input Styles
 * Reusable className strings for consistent form inputs
 */

// Standard text input
export const inputClassName = `
  w-full px-4 py-3 
  bg-white border-2 border-gray-300 
  rounded-lg 
  text-gray-900 placeholder-gray-500
  focus:ring-2 focus:ring-black focus:border-black 
  outline-none
  transition-colors
`;

// Input with error
export const inputErrorClassName = `
  w-full px-4 py-3 
  bg-white border-2 border-red-500 
  rounded-lg 
  text-gray-900 placeholder-gray-500
  focus:ring-2 focus:ring-red-500 focus:border-red-500 
  outline-none
  transition-colors
`;

// Select/Dropdown
export const selectClassName = `
  w-full px-4 py-3 
  bg-white border-2 border-gray-300 
  rounded-lg 
  text-gray-900
  focus:ring-2 focus:ring-black focus:border-black 
  outline-none
  transition-colors
  cursor-pointer
`;

// Textarea
export const textareaClassName = `
  w-full px-4 py-3 
  bg-white border-2 border-gray-300 
  rounded-lg 
  text-gray-900 placeholder-gray-500
  focus:ring-2 focus:ring-black focus:border-black 
  outline-none
  resize-none
  transition-colors
`;

// Helper function to get input className with optional error state
export function getInputClassName(hasError: boolean = false): string {
    return hasError ? inputErrorClassName.trim().replace(/\s+/g, ' ') : inputClassName.trim().replace(/\s+/g, ' ');
}

export function getTextareaClassName(hasError: boolean = false): string {
    const base = textareaClassName.trim().replace(/\s+/g, ' ');
    if (hasError) {
        return base.replace('border-gray-300', 'border-red-500').replace('focus:border-black', 'focus:border-red-500');
    }
    return base;
}
