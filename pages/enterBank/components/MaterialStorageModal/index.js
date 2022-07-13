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
import {
  updateMaterialStorage,
  addMaterialStorage
} from '../../../api/materialStorage'
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

const MaterialStorageModal = (props) => {
  const [form] = Form.useForm()
  const { handleCancel, isModalVisible, data, items } = props

  let newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
    newData.material = newData.material.map((item, index) => {
      return {
        uid: index,
        name: 'image.png',
        status: 'done',
        url:
          item ||
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fb7b5b489ab8adb866af91fee3019886c5389ff9d67ab-hH0Mm2_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659110343&t=fa34dd0b42d2ebd9b69b467164e60d9a'
      }
    })
  }
  const [isDsable, setIsDsable] = useState(false)
  const [fileList, setFileList] = useState(newData?.material || [])
  const [loading, setLoading] = useState(false)

  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      values.date = values.date.format('YYYY-MM-DD')
      values.material = values.material.map((item) => item.url)
      values.unitPrice = (values.price / values.weight).toFixed(2)

      if (isEmpty(data)) {
        addMaterialStorage(values).then((res) => {
          if (res) {
            setLoading(false)
            message.success('保存成功！')
            form.resetFields()
            handleCancel()
          } else {
            setLoading(false)
            message.error('保存失败！')
          }
        })
      } else {
        updateMaterialStorage(values, data.objectId).then((res) => {
          if (res) {
            setLoading(false)
            message.success('修改成功！')
            form.resetFields()
            handleCancel()
          } else {
            setLoading(false)
            message.error('修改失败！')
          }
        })
      }
    })
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }

    return e?.fileList.map((item) => item.originFileObj)
  }

  const handleChange = ({ file, fileList: newFileList }) => {
    file.status = 'uploading'
    setIsDsable(true)
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
        setIsDsable(false)
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

  return (
    isModalVisible && (
      <Modal
        title="请填写录入信息"
        visible={isModalVisible}
        onOk={onFinish}
        onCancel={handleCancel}
        getContainer={false}
        width={'60%'}
        confirmLoading={loading}
        destroyOnClose
        okButtonProps={{
          disabled: isDsable
        }}
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
            name="place"
            label="产地"
            rules={[
              {
                type: 'string',
                required: true,
                message: '请输入产地!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="产品名称"
            rules={[
              {
                type: 'string',
                required: true,
                message: '请输入产品名称!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="supplierName"
            label="供应商名称"
            rules={[
              {
                type: 'string',
                required: true,
                message: '请输入供应商名称!'
              }
            ]}
          >
            <Select style={{ width: 250 }}>
              {(items || []).map((item) => (
                <Option key={item.name}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="auditor"
            label="进库审核人"
            rules={[
              {
                required: true,
                message: '请选择进库审核人!'
              }
            ]}
          >
            <Select style={{ width: 250 }}>
              {['杨一凡', '米佳乐', '石喆'].map((name) => (
                <Option key={name}>{name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="weight"
            label="入库重量"
            rules={[
              {
                type: 'weight',
                required: true,
                message: '请输入入库重量（斤）!'
              }
            ]}
          >
            <InputNumber addonAfter="斤" min={0} />
          </Form.Item>
          <Form.Item
            name="price"
            label="应付款金额"
            rules={[
              {
                type: 'price',
                required: true,
                message: '请输入应付款金额!'
              }
            ]}
          >
            <InputNumber addonAfter="元" min={0} />
          </Form.Item>
          <Form.Item
            name="payAuditor"
            label="付款审核人"
            rules={[
              {
                required: true,
                message: '请选择付款审核人!'
              }
            ]}
          >
            <Select style={{ width: 250 }}>
              {['杨一凡', '米佳乐', '石喆'].map((name) => (
                <Option key={name}>{name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="pay"
            label="是否付款"
            rules={[
              {
                required: true,
                message: '请输选择!'
              }
            ]}
          >
            <Select>
              <Option value="现结">现结</Option>
              <Option value="月结">月结</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea />
          </Form.Item>
          <Form.Item
            name="material"
            label="证明材料"
            // valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                type: 'array',
                required: true,
                message: '请上传证明材料!'
              }
            ]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={beforeUpload}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                点击上传
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    )
  )
}

export default MaterialStorageModal
