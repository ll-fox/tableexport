import React, { useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Select } from 'antd'
import 'moment/locale/zh-cn'
import { updateProduct, addProduct } from '../../api/product'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
const { Option } = Select

const ProductModal = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { handleCancel, handleOk, isModalVisible, data, items } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }
  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      if (isEmpty(data)) {
        addProduct(values).then((res) => {
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
        updateProduct(values, data.objectId).then((res) => {
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
      title="商品信息"
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
          name="platform"
          label="平台名称"
          rules={[
            {
              required: true,
              message: '请选择平台名称!'
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
          name="produceName"
          label="商品名称"
          rules={[
            {
              required: true,
              message: '请输入商品名称!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="商品分类"
          rules={[
            {
              required: true,
              message: '请选择商品分类!'
            }
          ]}
        >
          <Select>
            <Option value="水果">水果</Option>
            <Option value="生鲜">生鲜</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="num"
          label="套餐数量"
          rules={[
            {
              required: true,
              message: '请输入套餐数量!'
            }
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="price"
          label="价格"
          rules={[
            {
              required: true,
              message: '请输入价格!'
            }
          ]}
        >
          <InputNumber min={1} addonAfter="元" />
        </Form.Item>
        <Form.Item
          name="state"
          label="上架状态"
          rules={[
            {
              required: true,
              message: '请选择上架状态!'
            }
          ]}
        >
          <Select>
            <Option value="已上架">已上架</Option>
            <Option value="已下架">已下架</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProductModal
