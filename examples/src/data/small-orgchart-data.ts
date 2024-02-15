import male1 from '../resources/usericon_male1.svg'
import male2 from '../resources/usericon_male2.svg'
import female1 from '../resources/usericon_female1.svg'
import { CustomOrgChartData } from '@yworks/react-yfiles-orgchart'
import { Employee } from './Employee.ts'

// The JSON model data for the organization chart example.
// Class TreeBuilder automatically creates
// a yFiles graph model from the data.
export default [
  {
    id: 1,
    position: 'Chief Executive Officer',
    name: 'Eric Joplin',
    email: 'ejoplin@yoyodyne.com',
    phone: '555-0100',
    fax: '555-0101',
    businessUnit: 'Executive Unit',
    status: 'present',
    icon: male1,
    subordinates: [2, 3, 15]
  },
  {
    id: 2,
    position: 'Senior Executive Assistant',
    name: 'Alexander Burns',
    email: 'aburns@yoyodyne.com',
    phone: '555-0102',
    fax: '555-0103',
    businessUnit: 'Executive Unit',
    icon: male2,
    status: 'busy'
  },
  {
    id: 3,
    position: 'Junior Executive Assistant',
    name: 'Linda Newland',
    email: 'lnewland@yoyodyne.com',
    phone: '555-0112',
    fax: '555-0113',
    businessUnit: 'Executive Unit',
    icon: female1,
    status: 'travel'
  }
] satisfies CustomOrgChartData<Employee>
