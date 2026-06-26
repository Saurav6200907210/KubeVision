import React from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface YamlViewerProps {
  yaml: string;
  height?: string;
}

export function YamlViewer({ yaml, height = '400px' }: YamlViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-border rounded-md overflow-hidden bg-[#1e1e1e]">
      <div className="flex justify-end p-2 bg-[#2d2d2d] border-b border-[#404040]">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy YAML'}
        </button>
      </div>
      <Editor
        height={height}
        defaultLanguage="yaml"
        theme="vs-dark"
        value={yaml}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 }
        }}
      />
    </div>
  );
}
