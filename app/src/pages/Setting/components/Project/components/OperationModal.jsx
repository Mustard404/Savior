import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Button, Result } from 'antd';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const OperationModal = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;

  if (!visible) {
    return null;
  };
  const imgprops = {
    beforeUpload: file => {
      if (file.type !== 'image/png') {
        message.error(`${file.name} is not a png file`);
      }
      return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
    },
    onChange: info => {
      let data = new FormData()
      data.append('img', info.fileList[0].file)
      console.log(data);
      return data
    },
  };


  return (
    <ModalForm
      visible={visible}
      title={done ? null : `${current ? '编辑' : '添加项目'}`}
      className={styles.standardListForm}
      width={640}
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
          <ProFormUploadButton 
            {...imgprops}
            label="上传" 
            name="project_logo"
            //action="./api/imgupload/" 
          />
          <ProFormText
            name="project_center"
            label="项目名称"
            rules={[
              {
                required: true,
                message: '请输入项目名称',
              },
            ]}
            placeholder="请输入"
          />
          <ProFormTextArea
            name="project_description"
            label="项目描述"
            rules={[
              {
                required: true,
                message: '请输入至少五个字符的项目描述！',
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

export default OperationModal;
