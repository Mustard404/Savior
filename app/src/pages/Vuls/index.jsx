import { Button, Dropdown, message, Menu, Popconfirm } from 'antd';
import { useRef } from 'react';
import { DownOutlined, DownloadOutlined  } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { queryvul, updateRule, deleteRule, vuldownload } from './service';



const TableList = () => {

  const actionRef = useRef();

  //漏洞修复请求
  const repairUpdate = async (id) => {
    const hide = message.loading('正在提交');
    const vul_status = '2';
    await updateRule({ id, vul_status });
    hide();
    message.success('复测成功，已修复！');
    actionRef.current.reload();
    return true;
  };

  //漏洞未修复请求
  const norepairUpdate = async (id) => {
    const hide = message.loading('正在提交');
    const vul_status = '1';
    await updateRule({ id, vul_status });
    hide();
    message.error('复测成功，未修复！');
    actionRef.current.reload();
    return true;
  };

  //漏洞删除
  const norepairDelete = async (id) => {
    const hide = message.loading('正在提交');
    await deleteRule({ id });
    hide();
    message.success('漏洞删除成功！');
    actionRef.current.reload();
    return true;
  };

  const columns = [
    {
      title: '所属项目',
      dataIndex: 'report_center',
      valueType: 'textarea',
    },
    {
      title: '系统',
      dataIndex: 'report_systemname',
      valueType: 'textarea',
    },
    {
      title: '报告编号',
      dataIndex: 'report_no',
      valueType: 'textarea',
    },
    {
      title: '发现人',
      dataIndex: 'report_author',
      valueType: 'textarea',
    },
    {
      title: '发现时间',
      dataIndex: 'report_end_time',
      valueType: 'date',
      search: false,
    },
    {
      title: '漏洞类型',
      dataIndex: 'vul_type_name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '漏洞名称',
      dataIndex: 'vul_name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '漏洞等级',
      dataIndex: 'vul_level',
      filters: true,
      onFilter: true,
      valueEnum: {
          1: {
          text: '低危',
          status: 'Success',
          },
          2: {
          text: '中危',
          status: 'Warning',
          },
          3: {
          text: '高危',
          status: 'Error',
          },
      },
    },
    {
      title: '漏洞URL',
      dataIndex: 'vul_url',
      valueType: 'textarea',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '漏洞状态',
      dataIndex: 'vul_status',
      filters: true,
      onFilter: true,
      valueEnum: {
          0: {
          text: '新发现',
          status: 'Warning',
          },
          1: {
          text: '未修复',
          status: 'Error',
          },
          2: {
          text: '已修复',
          status: 'Success',
          },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item 
                key="repairUpdate"
                onClick={() => {
                  repairUpdate(record.id);
                }}
              >
                已修复
              </Menu.Item>
              <Menu.Item 
                key="repairUpdate"
                onClick={() => {
                  norepairUpdate(record.id);
                }}
              >
                未修复
              </Menu.Item>
            </Menu>
          }
        >
          <a>
            复测 <DownOutlined />
          </a>
        </Dropdown>,
        <Popconfirm 
          key="norepairDelete" 
          title={`确认删除该漏洞吗?`} 
          okText="是" 
          cancelText="否"
          onConfirm={() => {
            norepairDelete(record.id);
          }}
        >
            <a>删除</a>
        </Popconfirm>
        /*
        <a 
          key="download"
          onClick={() => {
            download(record);
          }}
        >
          下载
        </a>
        */
      ],
    },
  ];
  return (
    <ProTable
      actionRef={actionRef}
      rowKey="key"
      search={{
        labelWidth: 120,
      }}
      request={queryvul}
      columns={columns}
      toolBarRender={() => [
        <Button type="primary" icon={<DownloadOutlined />} key="out" onClick={vuldownload}>
          导出数据
        </Button>,
      ]}
    />
  );
};

export default TableList;
