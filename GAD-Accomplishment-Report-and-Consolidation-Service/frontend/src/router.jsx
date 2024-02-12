import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./views/unauthorizedView/main_views/GuestLayout";
import AdminLayout from "./views/authorizedView/AdminLayout";
import ManageUsers from "./views/authorizedView/admin/ManageUsers";
import Forms from "./views/authorizedView/Forms/ActivityDesignForms";
import SubmitedForms from "./views/authorizedView/Forms/submitedForms/SubmitedForms";
import AccomplishmentReport from "./views/authorizedView/Forms/AccomplishmentReport";

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
            }
        ]
    },
])

export default router;