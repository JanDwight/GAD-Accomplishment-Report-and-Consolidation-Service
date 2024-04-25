import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./views/unauthorizedView/main_views/GuestLayout";
import AdminLayout from "./views/authorizedView/AdminLayout";
import ManageUsers from "./views/authorizedView/admin/components/ManageUser/ManageUsers";
import Forms from "./views/authorizedView/Forms/ActivityDesignForms";
import SubmitedForms from "./views/authorizedView/Forms/submitedForms/SubmitedForms";
import AccomplishmentReport from "./views/authorizedView/Forms/submitedForms/accomplishmentReport/AccomplishmentReport";
import CollegeLayout from "./views/authorizedView/CollegeLayout";
import AnnualReport from "./views/authorizedView/admin/components/annualReport/AnnualReport";
import TestTables from "./views/authorizedView/admin/components/annualreporttest/TestTables";
import ExcelImport from "./views/authorizedView/admin/components/exceltest/ExcelImport";
import Mandates from "./views/authorizedView/admin/components/mandates/Mandates";
import Dashboard from "./views/authorizedView/admin/components/dashboard/Dashboard";
import Profile from "./views/authorizedView/profile/Profile";

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />
    },

    {
        path: '/admin',
        element: <AdminLayout />,
        children:[
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'manageusers',
                element: <ManageUsers />
            },
            {
                path: 'forms',
                element: <Forms />
            },
            {
                path: 'submitedforms',
                element: <SubmitedForms />
            },
            {
                path: 'accomplishmentreport',
                element: <AccomplishmentReport />
            },
            {
                path: 'annualReport',
                element: <AnnualReport />
            },
            {
                path: 'annualreporttest',
                element: <TestTables/>
            },
            {
                path: 'exceltest',
                element: <ExcelImport/>
            },
            {
                path: 'mandates',
                element: <Mandates />
            },
            {
                path: 'profile',
                element: <Profile/>
            },
        ]
    },

    {
        path: '/college',
        element: <CollegeLayout />,
        children:[
            {
                path: 'forms',
                element: <Forms />
            },
            {
                path: 'submitedforms',
                element: <SubmitedForms />
            },
            {
                path: 'accomplishmentreport',
                element: <AccomplishmentReport />
            }
        ]
    },
])

export default router;