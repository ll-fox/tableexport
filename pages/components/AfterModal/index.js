import React from 'react'
import {
  Form,
  DatePicker,
  Input,
  Modal,
  InputNumber,
  message,
  Select
} from 'antd'
import 'moment/locale/zh-cn'
import { addItem, updateItem } from '../../api/aftersales'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
const { Option } = Select
const { TextArea } = Input
const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: 'Please select time!'
    }
  ]
}

const TableForm = (props) => {
  const [form] = Form.useForm()
  const { handleCancel, handleOk, isModalVisible, data } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      values.date = values.date.format('YYYY-MM-DD')
      if (isEmpty(data)) {
        addItem(values).then((res) => {
          if (res) {
            message.success('保存成功！')
            form.resetFields()
            handleOk()
          }
        })
      } else {
        updateItem(values, data.objectId).then((res) => {
          if (res) {
            message.success('修改成功！')
            form.resetFields()
            handleOk()
          } else {
            message.error('修改失败！')
          }
        })
      }
    })
  }

  return (
    <Modal
      title="请填写录入信息"
      visible={isModalVisible}
      onOk={onFinish}
      onCancel={handleCancel}
      getContainer={false}
      width={'60%'}
      destroyOnClose
    >
      <Form
        form={form}
        name="time_related_controls"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={newData}
        preserve={false}
      >
        <Form.Item name="date" label="售后反馈日期" {...config}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="platform"
          label="平台名称"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入平台名称!'
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
          <Input />
        </Form.Item>
        <Form.Item
          name="odd"
          label="快递单号"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入快递单号!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="收件人"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入收件人!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入收件人电话!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="地址"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入收件人地址!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="reason"
          label="售后原因"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入售后原因!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="dealwith"
          label="是否已处理"
          rules={[
            {
              required: true,
              message: '请输入单价!'
            }
          ]}
        >
          <Select>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </Form.Item>
        <Form.Item name="result" label="处理结果">
          <TextArea />
        </Form.Item>
        <Form.Item name="price" label="售后金额">
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TableForm
