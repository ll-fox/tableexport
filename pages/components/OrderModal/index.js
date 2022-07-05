import React, { useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Select } from 'antd'
import 'moment/locale/zh-cn'
import { updateItem } from '../../api/orderForm'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
const { Option } = Select
const { TextArea } = Input

const TableForm = (props) => {
  const [form] = Form.useForm()
  const { handleCancel, isModalVisible, data } = props
  const [loading, setLoading] = useState(false)
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      const afterPrice = item['售后金额'] ? item['售后金额'] : 0
      //总金额
      values.amount =
        (values.unitPrice + values.expressagePrice) * Number(item['数量']) -
        Number(afterPrice)
      updateItem(values, data.objectId).then((res) => {
        if (res) {
          message.success('修改成功！')
          form.resetFields()
          handleCancel()
        } else {
          message.error('修改失败！')
        }
        setLoading(false)
      })
    })
  }

  return (
    <Modal
      title="请填写修改信息"
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        initialValues={newData}
        preserve={false}
        style={{
          height: '450px',
          overflow: 'auto'
        }}
      >
        <Form.Item name="projectName" label="项目名称">
          <Input />
        </Form.Item>
        <Form.Item name="dockingPlatform" label="对接平台名称">
          <Input />
        </Form.Item>
        <Form.Item name="orderNumber" label="平台订单号">
          <Input />
        </Form.Item>
        <Form.Item name="expressCompany" label="快递公司">
          <Input />
        </Form.Item>
        <Form.Item name="trackingNumber" label="物流单号">
          <Input />
        </Form.Item>
        <Form.Item name="receiver" label="收件人姓名">
          <Input />
        </Form.Item>
        <Form.Item name="receiverTel" label="收件人电话">
          <InputNumber min={0} style={{ width: '60%' }} />
        </Form.Item>
        <Form.Item name="receiverAdd" label="收件人地址">
          <TextArea />
        </Form.Item>
        <Form.Item name="shipper" label="发件人姓名">
          <Input />
        </Form.Item>
        <Form.Item name="shipperTel" label="发件人电话">
          <InputNumber min={0} style={{ width: '60%' }} />
        </Form.Item>
        <Form.Item name="spece" label="规格名称">
          <Input />
        </Form.Item>
        <Form.Item name="num" label="数量">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="isAfter" label="是否售后">
          <Select>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </Form.Item>
        <Form.Item name="afterAmount" label="售后金额">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="afterReason" label="售后原因">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TableForm
