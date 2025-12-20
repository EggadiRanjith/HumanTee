// Standard input class - use this for all text inputs
export const INPUT_CLASS = "w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors";

// Input with error
export const INPUT_ERROR_CLASS = "w-full px-4 py-3 bg-white border-2 border-red-500 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors";

// Select/dropdown
export const SELECT_CLASS = "w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors cursor-pointer";

// Textarea
export const TEXTAREA_CLASS = "w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none resize-none transition-colors";

// Helper to get input class with conditional error
export const getInputClass = (hasError?: boolean) => hasError ? INPUT_ERROR_CLASS : INPUT_CLASS;
export const getTextareaClass = (hasError?: boolean) => hasError ? INPUT_ERROR_CLASS.replace('resize-none', '') + ' resize-none' : TEXTAREA_CLASS;
