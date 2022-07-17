import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Modal,
  InputNumber,
  message,
  Select,
  Button,
  DatePicker
} from 'antd'
import 'moment/locale/zh-cn'
import { updateProduct, addProduct } from '../../api/product'
import moment from 'moment'
import { cloneDeep, isEmpty, isArray, isUndefined } from 'lodash'
const { Option } = Select
const { RangePicker } = DatePicker

const ProductModal = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const { handleFinish, handleCancel, isModalVisible, data, items } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }

  useEffect(() => {
    if (!isEmpty(data)) {
      setList(data?.price)
    }
  }, [data])

  useEffect(() => {
    form.setFieldsValue({
      price: list
    })
  }, [form, list])

  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      if (isEmpty(data)) {
        addProduct(values).then((res) => {
          if (res) {
            setLoading(false)
            message.success('保存成功！')
            form.resetFields()
            handleFinish()
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
            handleFinish()
          } else {
            setLoading(false)
            message.error('修改失败！')
          }
        })
      }
    })
  }

  const setIntervalData = (value, type, index) => {
    list[index][type] = value
    form.setFieldsValue({
      price: [...list]
    })
    setList([...list])
  }

  const addRenderInterval = () => {
    setList([...list, {}])
  }

  const deleteInterval = (index) => {
    list.splice(index, 1)
    setList([...list])
  }
  const renderInterval = () => {
    return (
      <div>
        {list && list.map((item, index) => renderIntervalItem(item, index))}
        <Button type="primary" onClick={addRenderInterval}>
          +添加区间价格
        </Button>
      </div>
    )
  }

  const renderIntervalItem = (item, index) => {
    return (
      <div style={{ display: 'flex', marginBottom: '2px' }}>
        <RangePicker
          format="YYYYMMDD"
          value={
            !isEmpty(item)
              ? [
                  moment(item.date[0], 'YYYYMMDD'),
                  moment(item.date[1], 'YYYYMMDD')
                ]
              : []
          }
          style={{
            marginRight: '2px'
          }}
          onChange={(val, dateString) =>
            setIntervalData(dateString, 'date', index)
          }
        />
        <InputNumber
          value={item.price}
          onChange={(val) => setIntervalData(val, 'price', index)}
          min={0}
          // addonBefore="加价"
          addonAfter="元"
          style={{ width: 120 }}
        />
        <Button
          danger
          type="text"
          onClick={() => {
            deleteInterval(index)
          }}
        >
          删除
        </Button>
      </div>
    )
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
        wrapperCol={{ span: 16 }}
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
          <Select style={{ width: 250 }}>
            {(items || []).map((item) => (
              <Option key={item.name}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="produceName"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '请输入项目名称!'
            }
          ]}
        >
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="spece"
          label="商品规格名称"
          rules={[
            {
              required: true,
              message: '请输入商品规格名称!'
            }
          ]}
        >
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="price"
          label="价格"
          rules={[
            {
              required: true,
              type: 'array',
              validator: (rule, value, callback) => {
                if (isEmpty(value)) {
                  callback('请填写完整的区间价格！')
                } else if (isArray(value)) {
                  const index = (value || []).findIndex(
                    (item) => isUndefined(item.date) || isUndefined(item.price)
                  )
                  index >= 0 && callback('请填写完整的区间价格！')
                  callback()
                } else if (value === '') {
                  callback('请填写完整的区间价格！')
                } else {
                  form.setFieldsValue({
                    price: list
                  })
                  callback()
                }
              }
              // message: '请选择加价区域!'
            }
          ]}
        >
          {renderInterval()}
        </Form.Item>
        <Form.Item
          name="auditor"
          label="审核人"
          rules={[
            {
              required: true,
              message: '请选择审核人!'
            }
          ]}
        >
          <Select style={{ width: 250 }}>
            {['杨一凡', '米佳乐', '石喆'].map((name) => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProductModal
