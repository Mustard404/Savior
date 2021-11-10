import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Button, Result } from 'antd';

const AddModal = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;

  if (!visible) {
    return null;
  }

  return (
    <ModalForm
      visible={visible}
      title="添加漏洞模板"
      className={styles.standardListForm}
      width={500}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '72px 0',
            }
          : {},
      }}
    >
            {!done ? (
        <>
          <ProFormSelect
            name="program_type"
            label="漏洞类型"
            rules={[
              {
                required: true,
                message: '请选择漏洞类型',
              },
            ]}
            options={[
              {
                label: 'WEB漏洞',
                value: 'WEB漏洞',
              },
              {
                label: '移动客户端漏洞',
                value: '移动客户端漏洞',
              },
              {
                label: 'PC客户端漏洞',
                value: 'PC客户端漏洞',
              },
              {
                label: '智能硬件',
                value: '智能硬件',
              },
              {
                label: '其它',
                value: '其它',
              },
            ]}
            placeholder="请选择漏洞类型"
          />
          <ProFormText
            name="program_vul_name"
            label="漏洞名称"
            rules={[
              {
                required: true,
                message: '请输入漏洞名称',
              },
            ]}
            placeholder="请输入"
          />
          <ProFormTextArea
            name="program_describe"
            label="漏洞描述"
            rules={[
              {
                required: true,
                message: '请输入至少五个字符的漏洞描述！',
                min: 5,
              },
            ]}
            placeholder="请输入至少五个字符"
          />
          <ProFormTextArea
            name="program_repair"
            label="修复建议"
            rules={[
              {
                required: true,
                message: '请输入至少五个字符的修复建议！',
                min: 5,
              },
            ]}
            placeholder="请输入至少五个字符"
          />
        </>
        ) : (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};

export default AddModal;
