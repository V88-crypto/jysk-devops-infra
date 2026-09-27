import type { FlagOptionProps } from '../types/productForm'

const flagTextClass =
  'flex h-[52px] w-[280px] items-center border border-[#b9b9b9] bg-[#dedede] px-5 text-lg text-[#333]'

export const FlagOption = ({
  checked,
  disabled,
  label,
  tone = 'teal',
  onChange,
}: FlagOptionProps) => {
  const checkboxTone =
    tone === 'black'
      ? 'accent-black'
      : 'accent-primary'

  return (
    <label className="flex w-[320px] items-center gap-4">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className={`h-6 w-6 ${checkboxTone}`}
      />

      <span className={flagTextClass}>
        {label}
      </span>
    </label>
  )
}