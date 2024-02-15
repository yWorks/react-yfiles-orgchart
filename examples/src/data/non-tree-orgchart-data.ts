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
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female1.svg',
    subordinates: [2, 3]
  },
  {
    id: 2,
    position: 'Senior Executive Assistant',
    name: 'Alexander Burns',
    email: 'aburns@yoyodyne.com',
    phone: '555-0102',
    fax: '555-0103',
    businessUnit: 'Executive Unit',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female2.svg',
    status: 'busy',
    subordinates: [4, 5, 6]
  },
  {
    id: 3,
    position: 'Junior Executive Assistant',
    name: 'Linda Newland',
    email: 'lnewland@yoyodyne.com',
    phone: '555-0112',
    fax: '555-0113',
    businessUnit: 'Executive Unit',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_male3.svg',
    status: 'travel',
    subordinates: [4]
  },
  {
    position: 'Vice President of Engineering',
    name: 'Mildred Shark',
    email: 'mshark@yoyodyne.com',
    phone: '555-0156',
    fax: '555-0157',
    businessUnit: 'Engineering',
    status: 'present',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female2.svg',
    subordinates: [5],
    id: 4
  },
  {
    position: 'Marketing Manager',
    name: 'Angela Haase',
    email: 'ahaase@yoyodyne.com',
    phone: '555-0170',
    fax: '555-0171',
    businessUnit: 'Marketing',
    status: 'present',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female1.svg',
    subordinates: [],
    id: 5
  },
  {
    position: 'Chief Financial Officer',
    name: 'David Kerry',
    email: 'dkerry@yoyodyne.com',
    phone: '555-0180',
    fax: '555-0181',
    businessUnit: 'Accounting',
    status: 'present',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_male1.svg',
    subordinates: [],
    id: 6
  }
] satisfies CustomOrgChartData<Employee>
