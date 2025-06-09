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
    ]
  }
])


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
