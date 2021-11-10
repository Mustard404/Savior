import React, { useState } from 'react';
import {  PlusOutlined } from '@ant-design/icons';
import { Button, Col, Card, List, Modal } from 'antd';
import { useRequest } from 'umi';
import AddModal from './components/AddModal.jsx';
import UpdateModal from './components/UpdateModal.jsx';
import { addProgram, queryProgram, removeProgram, updateProgram } from './service';
import styles from './style.less';
import Ellipsis from 'react-ellipsis-component';


export const ProgramView = () => {
  const [done, setDone] = useState(false);
  const [addvisible, setAddvisible] = useState(false);
  const [updatevisible, setUpdatevisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(() => {
    return queryProgram();
  });

  const { run: postRun } = useRequest(
    
    (method, params) => {
      if (method === 'remove') {
        removeProgram(params);
        return queryProgram();
        //location.reload() 
      }
      if (method === 'update') {
        updateProgram(params);
        return queryProgram();
      }
      if (method === 'add') {
        addProgram(params);
        return queryProgram();
      }
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
    pageSize: 20,
    total: list.length,
  };

  const showEditModal = (item) => {
    setUpdatevisible(true);
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
    setAddvisible(false);
    setUpdatevisible(false);
    setCurrent({});
  };
  
  const addhandleSubmit = (values) => {
    setDone(true);
    const method = 'add';
    postRun(method, values);
  }
  const updatehandleSubmit = (values) => {
    setDone(true);
    const method = 'update';
    postRun(method, values);
  }

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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
              setAddvisible(true);
            }}
            style={{
              width: '100%',
              marginBottom: 8,
            }}
          >
            <PlusOutlined />
            添加漏洞模板
          </Button>
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
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
                expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
              >
                <Col span={4}>
                  <List.Item.Meta title={item.program_type} description={<strong>{item.program_vul_name}</strong>} />
                </Col>

                <Col span={12}>
                  <List.Item.Meta title="修复建议：" description={<Ellipsis text={item.program_repair} maxLine="3"/>} />
                </Col>
              </List.Item>
            )}
          />
        </Card>
      </div>
      <AddModal
        done={done}
        visible={addvisible}
        current={current}
        onDone={handleDone}
        onSubmit={addhandleSubmit}
      />
      <UpdateModal
        done={done}
        visible={updatevisible}
        current={current}
        onDone={handleDone}
        onSubmit={updatehandleSubmit}
      />
    </div>
  );
};

export default ProgramView;
