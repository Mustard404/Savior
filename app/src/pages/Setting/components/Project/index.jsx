import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, List, message, Modal } from 'antd';
import { useRequest } from 'umi';
import OperationModal from './components/OperationModal';
import { addProject, queryProject, removeFakeList, updateFakeList } from './service';
import styles from './style.less';

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(true);
      }, time);
  });
};

export const ProjectView = () => {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(() => {
    return queryProject({
      count: 50,
    });
  });


  const { run: postRun } = useRequest(
    (method, params) => {
      if (method === 'remove') {
        return removeFakeList(params);
      }

      if (method === 'update') {
        return updateFakeList(params);
      }

      return addProject(params);
    },
    {
      manual: true,
      onSuccess: (result) => {
        mutate(result);
      },
    },
  );
  const list = listData || [];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };

  const showEditModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id) => {
    postRun('remove', {
      id,
    });
  };

  const Delete = (currentItem) => {
    Modal.confirm({
      title: '删除任务',
      content: '确定删除该任务吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(currentItem.id),
    });
  };

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent({});
  };

  const handleSubmit = (values) => {
    setDone(true);
    const method = values?.id ? 'update' : 'add';
    postRun(method, values);
  };

  return (
    <div>
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          style={{
            marginTop: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
        >
          <Button
            type="dashed"
            onClick={() => {
              //setVisible(true);
              message.warning("请访问管理后台修改项目设置!(主要因为作者不会写)");
            }}
            style={{
              width: '100%',
              marginBottom: 8,
            }}
          >
            <PlusOutlined />
            添加项目
          </Button>
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={(item) => (
              
              <List.Item
                /*
                actions={[
                  <a
                    key="edit"
                    onClick={(e) => {
                      e.preventDefault();
                      showEditModal(item);
                    }}
                  >
                    编辑
                  </a>,
                  <a
                    key="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      Delete(item);
                    }}
                  >
                    删除
                  </a>,
                ]}
                */
              >
                <Col span={10}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.project_logo} shape="square" size="large" />}
                    title={item.project_center}
                    description={item.project_description}
                  />
                </Col>
                <Col span={6}>
                  <List.Item.Meta title="项目模板" description={item.project_template_name} />
                </Col>
              </List.Item>
            )}
          />
        </Card>
      </div>
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProjectView;
