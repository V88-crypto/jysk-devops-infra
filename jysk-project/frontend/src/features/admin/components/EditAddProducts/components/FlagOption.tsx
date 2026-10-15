import type { FlagOptionProps } from '@/features/admin/components/EditAddProducts/types/productForm'

const flagTextClass =
  'flex h-[52px] w-[280px] items-center border border-line-strong bg-surface-strong px-5 text-lg text-fg'

export const FlagOption = ({
  checked,
  disabled,
  label,
  tone = 'teal',
  onChange,
}: FlagOptionProps) => {
  const checkboxTone = tone === 'black' ? 'accent-fg' : 'accent-primary'

  return (
    <label className="flex w-[320px] items-center gap-4">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className={`h-6 w-6 ${checkboxTone}`}
      />

      <span className={flagTextClass}>{label}</span>
    </label>
  )
}
