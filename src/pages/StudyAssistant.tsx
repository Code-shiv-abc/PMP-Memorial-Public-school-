import { Bot } from 'lucide-react';

export function StudyAssistant() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 space-y-4">
      <Bot className="w-16 h-16 text-[#D4AF37]" />
      <h2 className="text-2xl font-serif text-white">
        AI Study Assistant
      </h2>
      <p className="text-gray-400 max-w-md">
        Coming soon.
      </p>
      <p className="text-[#D4AF37]/60 text-sm">
        Contact: 9792954343
      </p>
    </div>
  )
}

export default StudyAssistant;
