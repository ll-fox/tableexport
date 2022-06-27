import React, { useState } from 'react'
import {
  Form,
  DatePicker,
  Input,
  Modal,
  InputNumber,
  message,
  Select,
  Upload,
  Button
} from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
const AV = require('leancloud-storage')
import 'moment/locale/zh-cn'
import { updateCapital, addCapital } from '../../../api/capital'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
const { Option } = Select
const { TextArea } = Input
const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: '请选择时间!'
    }
  ]
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })

const ExpressageCapitalModal = (props) => {
  const [form] = Form.useForm()
  const { handleCancel, isModalVisible, data, expressageList } = props
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])

  console.log(3333, data)
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      values.date = values.date.format('YYYY-MM-DD')
      values.material = values.material.map((item) => item.url)
      if (isEmpty(data)) {
        addCapital(values).then((res) => {
          if (res) {
            message.success('保存成功！')
            form.resetFields()
            handleCancel()
          }
        })
      } else {
        updateCapital(values, data.objectId).then((res) => {
          if (res) {
            message.success('修改成功！')
            form.resetFields()
            handleCancel()
          } else {
            message.error('修改失败！')
          }
        })
      }
    })
  }

  const onCancel = () => {
    form.resetFields()
    handleCancel()
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }

    return e?.fileList.map((item) => item.originFileObj)
  }

  const cancel = () => setPreviewVisible(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  const handleChange = ({ file, fileList: newFileList }) => {
    file.status = 'uploading'
    return setFileList(newFileList)
  }
  const beforeUpload = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file)
    }
    const data = { base64: file.preview }
    const files = new AV.File(file.name, data)
    files.save().then(
      (value) => {
        file.status = 'done'
        file.url = value.url()
        setFileList([file])
        return true
      },
      (error) => {
        file.status === 'error'
        // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        message.error('上传失败!')
        return false
      }
    )
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        上传图片
      </div>
    </div>
  )

  return (
    <Modal
      title="请填写录入信息"
      visible={isModalVisible}
      onOk={onFinish}
      onCancel={onCancel}
      getContainer={false}
      width={'60%'}
      destroyOnClose
    >
      <Form
        form={form}
        name="time_related_controls"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={newData}
        preserve={false}
        style={{
          height: '450px',
          overflow: 'auto'
        }}
      >
        <Form.Item name="date" label="日期" {...config}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="projectName"
          label="项目名称"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入项目名称!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="expressage"
          label="快递公司"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入快递公司!'
            }
          ]}
        >
          <Select>
            {(expressageList || []).map((item) => (
              <Option key={item.expressage}>{item.expressage}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="负责人"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入负责人!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="payAcountName"
          label="付款帐号姓名"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入付款帐号姓名!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="payAcount"
          label="付款账号"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入付款账号!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="payPrice"
          label="付款金额"
          rules={[
            {
              type: 'number',
              required: true,
              message: '请输入付款金额!'
            }
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="payee"
          label="收款人"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入收款人!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="payeeName"
          label="收款账号姓名"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入收款账号姓名!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="payeeAcount"
          label="收款账号"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入收款账号!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea />
        </Form.Item>
        <Form.Item
          name="material"
          label="交易截图"
          // valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              type: 'array',
              required: true,
              message: '请上传交易截图!'
            }
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={cancel}
      >
        <img
          alt="example"
          style={{
            width: '100%'
          }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  )
}

export default ExpressageCapitalModal
