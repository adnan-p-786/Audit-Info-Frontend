import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Dashboard from './Pages/Dashboard/Dashboard.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Accountant from './Pages/Accountant/Accountant.tsx'
import Src from './Pages/SRC/Src.tsx'
import Sro from './Pages/SRO/Sro.tsx'
import OfficeAdministration from './Pages/Office Administration/OfficeAdministration.tsx'
import Agent from './Pages/Agent/Agent.tsx'
import LeadManagement from './Pages/Lead Management/LeadManagement.tsx'
import StudentManagement from './Pages/Student Management/StudentManagement.tsx'
import ParticularManagement from './Pages/Settings/ParticularManagement.tsx'
import Schoolmanagement from './Pages/Settings/Schoolmanagement.tsx'
import CollegeManagement from './Pages/Settings/CollegeManagement.tsx'
import BranchManagement from './Pages/Settings/BranchManagement.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import BranchManager from './Pages/Branch manager/BranchManager.tsx'
import LeadHistory from './Pages/Lead Management/LeadHistory.tsx'
import { Provider } from 'react-redux'
import store from './App/store.ts'
import AgentCollege from './Pages/Reports/AgentCollege.tsx'
import CancelledStudents from './Pages/Reports/CancelledStudents.tsx'
import EmployeeSales from './Pages/Reports/EmployeeSales.tsx'
import SeatBokkings from './Pages/Reports/SeatBokkings.tsx'
import Accounts from './Pages/Accounts/Accounts.tsx'
import AgentAccount from './Pages/Accounts/AgentAccount.tsx'
import CollegeAccount from './Pages/Accounts/CollegeAccount.tsx'
import EmployeeAccount from './Pages/Accounts/EmployeeAccount.tsx'
import LeadCallManagement from './Pages/Lead Management/LeadCallManagement.tsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/accountant',
        element: <Accountant />
      },
      {
        path: '/src',
        element: <Src />
      },
      {
        path: '/sro',
        element: <Sro />
      },
      {
        path: '/sro',
        element: <Sro />
      },
      {
        path: '/officeadministration',
        element: <OfficeAdministration />
      },
      {
        path: '/agent',
        element: <Agent />
      },
      {
        path: '/leadmanagement',
        element: <LeadManagement />
      },
      {
        path: '/studentmanagement',
        element: <StudentManagement />
      },
      {
        path: '/branchmanagement',
        element: <BranchManagement />
      },
      {
        path: '/collegemanagement',
        element: <CollegeManagement />
      },
      {
        path: '/schoolmanagement',
        element: <Schoolmanagement />
      },
      {
        path: '/particularmanagement',
        element: <ParticularManagement />
      },
      {
        path: '/branchmanager',
        element: <BranchManager />
      },
      {
        path: '/leadhistory',
        element: <LeadHistory />
      },
      {
        path: '/agentcollege',
        element: <AgentCollege />
      },
      {
        path: '/cancelledstudent',
        element: <CancelledStudents />
      },
      {
        path: '/employeesales',
        element: <EmployeeSales />
      },
      {
        path: '/seatbooking',
        element: <SeatBokkings />
      },
      {
        path: '/accounts',
        element: <Accounts />
      },
      {
        path: '/agentaccounts',
        element: <AgentAccount />
      },
      {
        path: '/collegeaccounts',
        element: <CollegeAccount />
      },
      {
        path: '/employeeaccounts',
        element: <EmployeeAccount />
      },
      {
        path: '/leadcallmanagement',
        element: <LeadCallManagement />
      },
    ]
  }
])


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
)
