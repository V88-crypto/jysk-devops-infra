import type { AttributeRowProps } from '../types/productForm'
import { TextField } from './TextField'

export const AttributeRow = ({
  row,
  disabled,
  onChange,
}: AttributeRowProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <TextField
        type="text"
        list="product-attributes"
        placeholder="Назва характеристики"
        value={row.name}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            row.id,
            'name',
            event.target.value,
          )
        }
      />

      <TextField
        type="text"
        placeholder="Значення характеристики"
        value={row.value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            row.id,
            'value',
            event.target.value,
          )
        }
      />
    </div>
  )
}