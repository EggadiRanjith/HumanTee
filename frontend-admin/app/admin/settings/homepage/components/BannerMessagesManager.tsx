'use client';

import { FiTrash2, FiPlus } from 'react-icons/fi';

interface Props {
    messages: string[];
    onChange: (messages: string[]) => void;
    isEditing: boolean;
}

export function BannerMessagesManager({ messages, onChange, isEditing }: Props) {
    const updateMessage = (index: number, value: string) => {
        const newMessages = [...messages];
        newMessages[index] = value;
        onChange(newMessages);
    };

    const addMessage = () => {
        onChange([...messages, '']);
    };

    const removeMessage = (index: number) => {
        onChange(messages.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Scrolling Banner</h2>
                <p className="text-sm text-gray-600 mt-1">Messages between products and reviews</p>
            </div>

            <div className="space-y-3">
                {messages.map((message, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e: any) => updateMessage(index, e.target.value)}
                            readOnly={!isEditing}
                            placeholder="Banner message"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                        />
                        {isEditing && messages.length > 1 && (
                            <button
                                onClick={() => removeMessage(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <button
                        onClick={addMessage}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add Message</span>
                    </button>
                )}
            </div>
        </div>
    );
}
