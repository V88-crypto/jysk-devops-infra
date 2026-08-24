import { mockEmployees } from '../mocks/employees'
import type { Employee } from '../../../types/employee'
import { mockDelay } from '../../../../shared/api/mockDelay'

const API_DELAY_MS = 500

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    await mockDelay(API_DELAY_MS)

    return mockEmployees.map((employee) => ({ ...employee }))
  },

  async getById(id: number): Promise<Employee | null> {
    await mockDelay(API_DELAY_MS)

    const employee = mockEmployees.find((item) => item.id === id)

    return employee ? { ...employee } : null
  },

  async update(employee: Employee): Promise<Employee> {
    await mockDelay(API_DELAY_MS)

    const employeeIndex = mockEmployees.findIndex(
      (item) => item.id === employee.id,
    )

    if (employeeIndex === -1) {
      throw new Error(`Employee with id ${employee.id} was not found`)
    }

    mockEmployees[employeeIndex] = { ...employee }

    return { ...employee }
  },

  async delete(id: number): Promise<void> {
    await mockDelay(API_DELAY_MS)

    const employeeIndex = mockEmployees.findIndex((item) => item.id === id)

    if (employeeIndex === -1) {
      throw new Error(`Employee with id ${id} was not found`)
    }

    mockEmployees.splice(employeeIndex, 1)
  },
}
