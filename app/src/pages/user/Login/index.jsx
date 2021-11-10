import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, message, Popover, Tabs } from 'antd';
import  { useState } from 'react';
import {  ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, FormattedMessage, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      // 登录
      const msg = await login({ ...values});
      
      if (msg.response.status === 200) {
        const access = msg.data.access
        const refresh = msg.data.refresh
        localStorage.setItem('access',access);
        localStorage.setItem('refresh',refresh);
        const defaultLoginSuccessMessage = "登录成功！"
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        // 此方法会跳转到 redirect 参数所在的位置

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        return;
      }
      setUserLoginState(msg);
    } catch (error) {
      if (error.response.status === 401){
        message.error("账户或密码错误，请重试！");
      }else{
        message.error("服务器错误！");
      }
    }
  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Savior"
          subTitle="渗透测试报告辅助生成工具"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab="账户密码登录"
            />
          </Tabs>
          {status === '401' && (
            <LoginMessage
              content="账户或密码错误"
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <Popover placement="topLeft" content="请联系管理员！"  >
                <Button type="link" id="pages.login.forgotPassword">忘记密码</Button>
              </Popover>
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
