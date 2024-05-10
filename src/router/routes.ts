//对外暴露配置路由(常量路由)
export const constantRoute = [
    {
        //登录
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'Login',//命名路由，用于权限等
        meta: {
            title: '登录',//菜单需要标题
            hidden: true,//路由的标题在菜单中隐藏 1：隐藏
            icon: "Promotion"//菜单图标
        }
    },
    {
        //登录成功展示数据
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        meta: {
            title: '',//菜单需要标题 空为了方便面包屑组件显示HOME
            hidden: false,
            icon: "Minus"
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',//菜单需要标题
                    hidden: false,
                    icon: "HomeFilled"
                }
            },

        ]
    },
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            title: '数据大屏',//菜单需要标题
            hidden: false,
            icon: "DataBoard"
        }
    },

    {
        //404
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',//菜单需要标题
            hidden: true,
            icon: "Female"
        }
    },
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',//菜单需要标题
            hidden: false,
            icon: "Lock"
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',//菜单需要标题
                    hidden: false,
                    icon: "User"
                }
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',//菜单需要标题
                    hidden: false,
                    icon: "UserFilled"
                }
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',//菜单需要标题
                    hidden: false,
                    icon: "Histogram"
                }
            },
        ]
    },
    {
        path: '/quality',
        component: () => import('@/layout/index.vue'),
        name: 'quality',
        meta: {
            title: '质量管理',//菜单需要标题
            hidden: false,
            icon: "Goods"
        },
        redirect: '/quality/rp2',
        children: [
            //门槛二线
            {
                path: '/quality/rp2',
                component: () => import('@/views/rockpanel/line2/index.vue'),
                name: 'rp2',
                meta: {
                    title: '门槛二线',//菜单需要标题
                    hidden: false,
                    icon: "Picture"
                }
            },
          //门槛三线
            {
                path: '/quality/rp3',
                component: () => import('@/views/rockpanel/line3/index.vue'),
                name: 'rp3',
                meta: {
                    title: '门槛三线',//菜单需要标题
                    hidden: false,
                    icon: "Picture"
                }
            },
            //面漆一线缺陷检测
            // {
            //     path: '/quality/topline1',
            //     component: () => import('@/views/rockpanel/topline1/index.vue'),
            //     name: 'topline1',
            //     meta: {
            //         title: 'test',//菜单需要标题
            //         hidden: false,
            //         icon: "Picture"
            //     }
            // },
            // {
            //     path: '/quality/toplinecheck',
            //     component: () => import('@/views/rockpanel/toplinecheck/index.vue'),
            //     name: 'toplinecheck',
            //     meta: {
            //         title: '面漆缺陷检测',//菜单需要标题
            //         hidden: false,
            //         icon: "Picture"
            //     }
            // },
            //SPU管理
            // {
            //     path: '/product/spu',
            //     component: () => import('@/views/product/spu/index.vue'),
            //     name: 'Spu',
            //     meta: {
            //         title: 'SPU管理',//菜单需要标题
            //         hidden: false,
            //         icon: "User"
            //     }
            // },
            // //SKU管理
            // {
            //     path: '/product/sku',
            //     component: () => import('@/views/product/sku/index.vue'),
            //     name: 'Sku',
            //     meta: {
            //         title: 'SPU管理',//菜单需要标题
            //         hidden: false,
            //         icon: "User"
            //     }
            // },
        ]
    },
]
//异步路由
export const asyncRoute = [
    {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
        title: '权限管理',//菜单需要标题
        hidden: false,
        icon: "Lock"
    },
    redirect: '/acl/user',
    children: [
        {
            path: '/acl/user',
            component: () => import('@/views/acl/user/index.vue'),
            name: 'User',
            meta: {
                title: '用户管理',//菜单需要标题
                hidden: false,
                icon: "User"
            }
        },
        {
            path: '/acl/role',
            component: () => import('@/views/acl/role/index.vue'),
            name: 'Role',
            meta: {
                title: '角色管理',//菜单需要标题
                hidden: false,
                icon: "UserFilled"
            }
        },
        {
            path: '/acl/permission',
            component: () => import('@/views/acl/permission/index.vue'),
            name: 'Permission',
            meta: {
                title: '菜单管理',//菜单需要标题
                hidden: false,
                icon: "Menu"
            }
        },
    ]
},
{
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
        title: '商品管理',//菜单需要标题
        hidden: false,
        icon: "Goods"
    },
    redirect: '/product/trademark',
    children: [
        {
            path: '/product/trademark',
            component: () => import('@/views/product/trademark/index.vue'),
            name: 'Trademark',
            meta: {
                title: '品牌管理',//菜单需要标题
                hidden: false,
                icon: "UserFilled"
            }
        },
        {
            path: '/product/attr',
            component: () => import('@/views/product/attr/index.vue'),
            name: 'Attr',
            meta: {
                title: '属性管理',//菜单需要标题
                hidden: false,
                icon: "UserFilled"
            }
        },
        {
            path: '/product/spu',
            component: () => import('@/views/product/spu/index.vue'),
            name: 'Spu',
            meta: {
                title: 'SPU管理',//菜单需要标题
                hidden: false,
                icon: "User"
            }
        },
        {
            path: '/product/sku',
            component: () => import('@/views/product/sku/index.vue'),
            name: 'Sku',
            meta: {
                title: 'SKU管理',//菜单需要标题
                hidden: false,
                icon: "User"
            }
        },
    ]
},
]
//任意路由
export const anyRoute = [{
    path: '/:pathMath(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',//菜单需要标题
        hidden: true,
        icon: "Male"
    }
},]