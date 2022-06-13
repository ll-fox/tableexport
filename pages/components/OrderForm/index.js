import React from 'react'
import { Form, Input, Modal, InputNumber, message, Select } from 'antd'
import 'moment/locale/zh-cn'
import { updateItem } from '../../api/orderForm'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
const { Option } = Select

const TableForm = (props) => {
  const [form] = Form.useForm()
  const { handleCancel, handleOk, isModalVisible, data } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      updateItem(values, data.objectId).then((res) => {
        if (res) {
          message.success('修改成功！')
          form.resetFields()
          handleOk()
        } else {
          message.error('修改失败！')
        }
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
          height: '520px',
          overflow: 'auto'
        }}
      >
        <Form.Item name="dockingPlatform" label="对接平台名称">
          <Input />
        </Form.Item>
        <Form.Item name="shippingWhse" label="发货仓库">
          <Input />
        </Form.Item>
        <Form.Item name="expressCompany" label="快递公司">
          <Input />
        </Form.Item>
        <Form.Item name="receiver" label="收件人姓名">
          <Input />
        </Form.Item>
        <Form.Item name="ReceiverTel" label="收件人电话">
          <Input />
        </Form.Item>
        <Form.Item name="ReceiverAdd" label="收件人地址">
          <Input />
        </Form.Item>
        <Form.Item name="shipper" label="发件人姓名">
          <Input />
        </Form.Item>
        <Form.Item name="shipperTel" label="发件人电话">
          <Input />
        </Form.Item>
        <Form.Item name="spece" label="规格名称">
          <Input />
        </Form.Item>
        <Form.Item name="afterMarketService" label="是否售后">
          <Select>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </Form.Item>
        <Form.Item name="amount" label="总金额">
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TableForm
