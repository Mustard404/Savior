export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/report',
  },
  /*
{
name: '分析页',
icon: 'DashboardOutlined',
path: '/dashboard',
component: './Dashboard',
},*/
  {
    name: '创建报告',
    icon: 'PlusSquareOutlined',
    path: '/report',
    component: './Report',
  },
  {
    name: '漏洞列表',
    icon: 'FileSearchOutlined',
    path: '/vuls',
    component: './Vuls',
  },
  {
    name: '个人设置',
    icon: 'SettingOutlined',
    path: '/setting',
    component: './Setting',
  },
  {
    component: './404',
  },
];
