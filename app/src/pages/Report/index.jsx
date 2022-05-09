import { CloseCircleOutlined } from '@ant-design/icons';
import {  Button, Card, Col, Form, Popover, Row, Popconfirm , message } from 'antd';
import { useState } from 'react';
import ProForm, {
  DrawerForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormField
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { FooterToolbar } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { addreport, queryProject, queryProgram, queryProgramdata } from './service';
import styles from './style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import ProCard from '@ant-design/pro-card';


const fieldLabels = {
  report_center: '所属项目',
  report_systemname: '所属系统',
  report_no: '报告编号',
  report_start_time: '测试开始时间',
  report_end_time: '测试结束时间',
  report_test_url: '测试Url',
};

const FormAdvancedForm = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const onGenderChange = (value) => {
    queryProgramdata(value).then(res => {
      form.setFieldsValue({
        vul_type_name: res.program_vul_name,
        vul_name: res.program_vul_name,
        vul_recurrence: '',
        vul_describe: res.program_describe,
        vul_modify_repair: res.program_repair,
      });
      return;
    })
  }
  const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'link'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }], 
        ['blockquote', 'code-block'],
        ['clean']    
    ]
  }
  const [error, setError] = useState([]);
  const getErrorInfo = (errors) => {
    
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = async (values) => {
    setError([]);
    values.vuls = dataSource
    //console.log(values)
    try {
      await addreport(values);
      message.success('提交成功，报告自动下载后请手动刷新页面！');

    } catch {
      message.error('提交失败，请核实！');
    }
  };

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  const columns = [
    {
      title: '漏洞类型',
      dataIndex: 'vul_type_name',
      key: 'vul_type_name',
      width: '20%',
    },
    {
      title: '漏洞名称',
      dataIndex: 'vul_name',
      key: 'vul_name',
      width: '20%',
    },
    {
      title: '漏洞等级',
      dataIndex: 'vul_level',
      hideInForm: true,
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
      width: '10%',
    },
    {
      title: '漏洞URL',
      dataIndex: 'vul_url',
      key: 'vul_url',
      width: '30%',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record, index, action) => {
        return [
            <Popconfirm 
              title="确定删除该漏洞吗？" 
              onConfirm={() => {
              setDataSource(dataSource.filter((item) => item.id !== record.id))
              }}
            >
              <a>删除</a>
            </Popconfirm>
          ,
        ];
      },
    },
  ];
  return (
    <ProForm
      layout="vertical"
      hideRequiredMark
      submitter={{
        render: (props, dom) => {
          return (
            <FooterToolbar>
              {getErrorInfo(error)}
              {dom}
            </FooterToolbar>
          );
        },
      }}
      
      initialValues={{
        report_no: new Date().getTime(),
        report_start_time: moment(),
        report_end_time: moment(),
      }}
      
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <>
      <Card title="报告管理" className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label={fieldLabels.report_center}
              name="report_center"
              rules={[
                {
                  required: true,
                  message: '请选择所属项目',
                },
              ]}
              request={async () => {
                return queryProject().then(({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.project_center,
                      value: item.project_center,
                    };
                  });
                });
              }}
              placeholder="请选择"
            />
          </Col>
          <Col
            xl={{
              span: 6,
              offset: 2,
            }}
            lg={{
              span: 8,
            }}
            md={{
              span: 12,
            }}
            sm={24}
          >
            <ProFormText
              label={fieldLabels.report_systemname}
              name="report_systemname"
              rules={[
                {
                  required: true,
                  message: '请输入所属系统',
                },
                {
                  pattern: '^[\u4e00-\u9fa5_a-zA-Z0-9]+$',
                  message: '禁止输入空格及特殊符号',
                }
              ]}
              placeholder="请输入"
            />
          </Col>
          <Col
            xl={{
              span: 8,
              offset: 2,
            }}
            lg={{
              span: 10,
            }}
            md={{
              span: 24,
            }}
            sm={24}
          >
            <ProFormText
              label={fieldLabels.report_no}
              name="report_no"
              rules={[
                {
                  required: true,
                },
              ]}
              placeholder="请刷新页面生成报告编号"
              disabled
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormDatePicker
              label={fieldLabels.report_start_time}
              name="report_start_time"
              fieldProps={{
                style: {
                  width: '100%',
                },
              }}
              rules={[
                {
                  required: true,
                  message: '请选择测试开始日期',
                },
              ]}
            />
          </Col>
          <Col
            xl={{
              span: 6,
              offset: 2,
            }}
            lg={{
              span: 8,
            }}
            md={{
              span: 12,
            }}
            sm={24}
          >
            <ProFormDatePicker
              label={fieldLabels.report_end_time}
              name="report_end_time"
              fieldProps={{
                style: {
                  width: '100%',
                },
              }}
              rules={[
                {
                  required: true,
                  message: '请选择测试结束日期',
                },
              ]}
              disabled
            />
          </Col>
          <Col
            xl={{
              span: 8,
              offset: 2,
            }}
            lg={{
              span: 10,
            }}
            md={{
              span: 24,
            }}
            sm={24}
          >
            <ProFormText
              label={fieldLabels.report_test_url}
              name="report_test_url"
              rules={[
                {
                  required: true,
                },
              ]}
              placeholder="请输入测试Url"
            />
          </Col>
        </Row>
      </Card>

      <Card title="漏洞管理" bordered={false}>
        <ProForm.Item name="vuls">
          <ProTable 
            columns={columns} 
            dataSource={dataSource}
            search={false}
            toolBarRender={false}
            pagination={false} 
          />
        </ProForm.Item>
        <DrawerForm 
          title="添加漏洞" 
          trigger={
            <Button 
              type="dashed" 
              block
            >
              <PlusOutlined />
                添加漏洞
            </Button>
          }
          form={form} 
          drawerProps={{
            forceRender: true,
            destroyOnClose: true,
          }} 
          onFinish={
            async (values) => {
              message.success('漏洞保存成功，请勿刷新页面!');
              let vuls=[...dataSource]
              values.id=`0${Date.now()}`
              vuls.push(values);
              setDataSource(vuls);
              return true;
            }
          }>

          <ProForm.Group>
            <ProFormSelect
              showSearch
              placeholder="搜索或选择"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              width="md" 
              label="漏洞类型"
              name="vul_type_name"
              onChange={onGenderChange}
              request={async () => {
                return queryProgram().then(({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.program_vul_name,
                      value: item.id,
                    };
                  });
                });
              }}
              rules={[
                {
                  required: true,
                  message: '请选择漏洞类型',
                },
              ]}
            />
            <ProFormText
              width="md" 
              name="vul_name" 
              label="漏洞名称"
              rules={[
                {
                  required: true,
                  message: '请输入漏洞名称',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              width="md" 
              label="漏洞级别"
              name="vul_level"
              request={async () => [
                { label: '高危', value: '3' },
                { label: '中危', value: '2' },
                { label: '低危', value: '1' },
              ]}
              rules={[
                {
                  required: true,
                  message: '请选择漏洞级别',
                },
              ]}
            />
            <ProFormText
              width="md" 
              name="vul_url" 
              label="漏洞Url"
              rules={[
                {
                  required: true,
                  message: '请输入漏洞Url',
                },
              ]}
            />
          </ProForm.Group>
          <Form.Item
            name="vul_recurrence"
            label="复现步骤"
            rules={[
              {
                required: true,
                message: '请填写复现步骤',
              },
            ]}
          >
            <ReactQuill
              modules={modules}
            />
          </Form.Item>
          <ProFormTextArea
              whiteSpace= 'pre-wrap' 
              name="vul_describe" 
              label="漏洞描述"
              rows={3}
              rules={[
                {
                  required: true,
                  message: '请输入漏洞描述',
                },
              ]}
          />
          <ProFormTextArea
              whiteSpace= 'pre-wrap' 
              name="vul_modify_repair" 
              label="修复建议"
              rows={3}
              rules={[
                {
                  required: true,
                  message: '请输入修复建议',
                },
              ]}
          />

        </DrawerForm>
      </Card>
      {/**
      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
       */}
      </>
    </ProForm>
  );
};

export default FormAdvancedForm;
