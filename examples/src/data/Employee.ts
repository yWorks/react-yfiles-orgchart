/**
 * A type that describes an Employee.
 * The data is displayed in the properties panel on the right.
 * It is also presented in the node style and considered in the layout.
 */
export type Employee = {
  status?: Status
  position?: string
  name?: string
  email?: string
  phone?: string
  fax?: string
  businessUnit?: string
  icon?: string
}

export type Status = 'present' | 'busy' | 'travel' | 'unavailable'
