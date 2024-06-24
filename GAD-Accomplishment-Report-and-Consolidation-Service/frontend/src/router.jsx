import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./views/unauthorizedView/main_views/GuestLayout";
import AdminLayout from "./views/authorizedView/admin/AdminLayout";
import ManageUsers from "./views/authorizedView/admin/components/ManageUser/ManageUsers";
import Forms from "./views/authorizedView/Forms/ActivityDesignFormsChoices";
import SubmitedForms from "./views/authorizedView/Forms/submitedForms/SubmitedForms";
import AccomplishmentReport from "./views/authorizedView/Forms/submitedForms/accomplishmentReport/AccomplishmentReport";
import UsersLayout from "./views/authorizedView/users/UsersLayout";
import AnnualReport from "./views/authorizedView/admin/components/annualReport/AnnualReport";
import AssignMandates from "./views/authorizedView/admin/components/mandates/AssignMandates";
import Mandates from "./views/authorizedView/admin/components/mandates/Mandates";
import Dashboard from "./views/authorizedView/admin/components/dashboard/Dashboard";
import Profile from "./views/authorizedView/profile/Profile";
import Logs from "./views/components/logs/Logs";
import PreviousReport from "./views/authorizedView/admin/components/previousReports/PreviousReport";
import ArchivedPdfs from "./views/authorizedView/admin/components/previousReports/components/ArchivedPdfs";
import TWGPage from "./views/components/footer/components/TWGPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />
    },

    {
        path: '/twg',
        element: <TWGPage />
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
                path: 'assignmandates',
                element: <AssignMandates/>
            },
            {
                path: 'mandates',
                element: <Mandates />
            },
            {
                path: 'profile',
                element: <Profile/>
            },
            {
                path: 'logs',
                element: <Logs/>
            },
            {
                path: 'previousreports',
                element: <PreviousReport/>
            },
            {
                path: 'archivedpdfs',
                element: <ArchivedPdfs/>
            },
        ]
    },

    {
        path: '/user',
        element: <UsersLayout />,
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
            },
            {
                path: 'profile',
                element: <Profile/>
            },
        ]
    },
])

export default router;