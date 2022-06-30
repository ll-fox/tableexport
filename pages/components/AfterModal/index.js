import React, { useState, useEffect } from 'react'
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
import { addItem, updateItem, judgeContains } from '../../api/aftersales'
import { fetchPlatform } from '../../api/product'
import { fetchExpressage } from '../../api/expressage'
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

const TableForm = (props) => {
  const [form] = Form.useForm()
  const { handleCancel, isModalVisible, data } = props
  const [items, setItems] = useState([])
  const [expressages, setExpressages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPlatform().then((res) => {
      setItems(res)
    })
    fetchExpressage().then((res) => {
      setExpressages(res)
    })
  }, [])
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      values.date = values.date.format('YYYY-MM-DD')
      if (isEmpty(data)) {
        judgeContains(values.odd).then((res) => {
          if (isEmpty(res)) {
            addItem(values).then((res) => {
              if (res) {
                setLoading(false)
                message.success('保存成功！')
                form.resetFields()
                handleCancel()
              } else {
                setLoading(false)
                message.success('保存失败！')
                form.resetFields()
              }
            })
          } else {
            setLoading(false)
            message.error('该订单已经存在于订单里！')
          }
        })
      } else {
        updateItem(values, data.objectId).then((res) => {
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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={newData}
        preserve={false}
        style={{
          height: '450px',
          overflow: 'auto'
        }}
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
              message: '请选择平台!'
            }
          ]}
        >
          <Select>
            {(items || []).map((item) => (
              <Option key={item.name}>{item.name}</Option>
            ))}
          </Select>
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
            {(expressages || []).map((item) => (
              <Option key={item.expressage}>{item.expressage}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="platformOrderNumber" label="平台订单号">
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
        <Form.Item name="username" label="收件人">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="电话">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="地址">
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
