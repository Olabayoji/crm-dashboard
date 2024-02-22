import { DashboardOutlined, ProjectOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resources : IResourceItem[] = [
    {
        name: 'dashboard',
        list: '/',
        meta: {
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        
    },
    {
        name: 'companies',
        list: '/companies',
        show: '/companies/:id',
        create: '/companies/new',
        edit: '/companies/:id/edit',

        meta: {
            label: 'Companies',
            icon: <ShopOutlined />,
        },
        
    },
    {
        name: 'tasks',
        list: '/tasks',
        create: '/tasks/new',
        edit: '/tasks/:id/edit',

        meta: {
            label: 'Tasks',
            icon: <ProjectOutlined />,
        },
        
    },
 
]