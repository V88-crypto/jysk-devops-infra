import { useRef, useState } from 'react'

export const useLineItemRows = <T extends { id: number }>(
  createRowFields: () => Omit<T, 'id'>,
  initialCount = 2,
) => {
  const [rows, setRows] = useState<T[]>(() =>
    Array.from(
      { length: initialCount },
      (_, index) => ({ ...createRowFields(), id: index + 1 }) as T,
    ),
  )

  const nextIdRef = useRef(initialCount + 1)

  const updateRow = <Field extends keyof T>(
    rowId: number,
    field: Field,
    value: T[Field],
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    )
  }

  const addRow = () => {
    const newRow = { ...createRowFields(), id: nextIdRef.current } as T
    nextIdRef.current += 1

    setRows((currentRows) => [...currentRows, newRow])
  }

  const removeRow = (rowId: number) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId))
  }

  return { rows, setRows, updateRow, addRow, removeRow }
}
