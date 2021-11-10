import React from 'react';
import { message, Tooltip  } from 'antd';
import ProForm, {
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { queryCurrent } from '../../service';
import styles from './style.less';


const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
  </>
);

const BaseView = () => {
  const { data:currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });


  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  };

  const handleFinish = async () => {
    message.warning("请访问管理后台修改个人信息!");
  };


  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{ ...currentUser }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="username"
                label="用户名"
                disabled
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="昵称"
                disabled
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                disabled
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
              <ProFormSwitch 
                name="autosentmail" 
                label="自动邮件" 
                required tooltip="自动发送渗透测试报告至邮箱！"
                disabled
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
