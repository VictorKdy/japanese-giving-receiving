import React from 'react';
import { CheckCheck } from 'lucide-react';

export function Checkbox({ label, checked, onChange, disabled = false }) {
  return (
    <label className={`flex items-center gap-3 group mb-2 select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:cursor-pointer'}`}>
      <div className={`w-5 h-5 rounded border border-gray-600 flex items-center justify-center transition-all ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${
        checked ? 'bg-green-600 border-transparent' : 'bg-[#222] group-hover:border-gray-500'
      }`}>
        {checked && <CheckCheck size={14} className="text-white" />}
      </div>
      <span className={`text-sm ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'text-gray-200 font-bold' : 'text-gray-500'}`}>{label}</span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
    </label>
  );
}
