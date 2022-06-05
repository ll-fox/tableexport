import React from 'react'
import { Form, DatePicker, Input, Modal, InputNumber, message } from 'antd'
import 'moment/locale/zh-cn'
import { addItem, updateItem } from '../../api/hello'
import moment from 'moment'
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
  const newData = JSON.parse(JSON.stringify(data))
  newData.date = moment(data.date)
  newData.rePriceDate = data.rePriceDate ? moment(data.rePriceDate) : ''
  const onFinish = () => {
    form.validateFields().then((values) => {
      ;(values.date = values.date.format('YYYY-MM-DD')),
        (values.rePriceDate = values.rePriceDate
          ? values.rePriceDate.format('YYYY-MM-DD')
          : '')
      values.price = values.num * values.unitPrice
      if (JSON.stringify(data) == '{}') {
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
        <Form.Item name="date" label="送货日期" {...config}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="name"
          label="品名"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入品名!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="num"
          label="数量"
          rules={[
            {
              type: 'number',
              required: true,
              message: '请输入数量!'
            }
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="unitPrice"
          label="单价"
          rules={[
            {
              type: 'number',
              required: true,
              message: '请输入单价!'
            }
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="rePriceDate" label="回款日期">
          <DatePicker />
        </Form.Item>
        <Form.Item name="rePrice" label="回款金额">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TableForm
