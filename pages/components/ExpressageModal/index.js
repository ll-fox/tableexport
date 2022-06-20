import React, { useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Select } from 'antd'
import 'moment/locale/zh-cn'
import { updateExpressage, addExpressage } from '../../api/expressage'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
import { PROVINCES } from '../../../public/static/constant'

const { Option } = Select

const ExpressageModal = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { handleCancel, handleOk, isModalVisible, data } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      if (isEmpty(data)) {
        addExpressage(values).then((res) => {
          if (res) {
            setLoading(false)
            message.success('保存成功！')
            form.resetFields()
            handleOk()
          } else {
            setLoading(false)
            message.error('保存失败！')
          }
        })
      } else {
        updateExpressage(values, data.objectId).then((res) => {
          if (res) {
            setLoading(false)
            message.success('修改成功！')
            form.resetFields()
            handleOk()
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
      title="加价信息"
      visible={isModalVisible}
      onOk={onFinish}
      onCancel={handleCancel}
      getContainer={false}
      width={'60%'}
      confirmLoading={loading}
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
          overflow: 'auto'
        }}
      >
        <Form.Item
          name="expressage"
          label="快递公司"
          rules={[
            {
              required: true,
              message: '请选择公司名称!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="raisePriceArea"
          label="加价区域"
          rules={[
            {
              required: true,
              message: '请选择加价区域!'
            }
          ]}
        >
          <Select showSearch>
            {PROVINCES.map((name) => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="raisePrice"
          label="加价金额"
          rules={[
            {
              required: true,
              message: '请输入加价金额!'
            }
          ]}
        >
          <InputNumber min={0} addonAfter="元" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ExpressageModal
