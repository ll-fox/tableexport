import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Modal,
  InputNumber,
  message,
  Select,
  Button,
  Space,
  MinusCircleOutlined
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { isUndefined } from 'lodash'

import 'moment/locale/zh-cn'
import { updateExpressage, addExpressage } from '../../api/expressage'
import moment from 'moment'
import { cloneDeep, isEmpty, isArray } from 'lodash'
import { PROVINCES } from '../../../public/static/constant'

const { Option } = Select

const ExpressageModal = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const { handleCancel, isModalVisible, data } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
  }

  useEffect(() => {
    if (!isEmpty(data)) {
      setList(data?.raisePriceArea)
    }
  }, [data])

  useEffect(() => {
    form.setFieldsValue({
      raisePriceArea: list
    })
  }, [form, list])

  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      if (isEmpty(data)) {
        addExpressage(values).then((res) => {
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
        updateExpressage(values, data.objectId).then((res) => {
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

  const setAreaData = (value, type, index) => {
    list[index][type] = value
    form.setFieldsValue({
      raisePriceArea: [...list]
    })
    setList([...list])
  }

  const addrenderArea = () => {
    setList([...list, {}])
  }

  const deleteArea = (index) => {
    list.splice(index, 1)
    setList([...list])
  }
  const renderArea = () => {
    return (
      <div>
        {list && list.map((item, index) => renderAreaItem(item, index))}
        <Button type="primary" onClick={addrenderArea}>
          添加区域
        </Button>
      </div>
    )
  }

  const renderAreaItem = (item, index) => {
    return (
      <div style={{ display: 'flex', marginBottom: '2px' }}>
        <Select
          showSearch
          value={item.area}
          mode="multiple"
          style={{
            marginRight: '2px'
          }}
          onChange={(val) => setAreaData(val, 'area', index)}
        >
          {PROVINCES.map((name) => (
            <Option key={name}>{name}</Option>
          ))}
        </Select>
        <InputNumber
          value={item.price}
          onChange={(val) => setAreaData(val, 'price', index)}
          min={0}
          addonBefore="加价"
          addonAfter="元"
        />
        <Button
          danger
          type="text"
          onClick={() => {
            deleteArea(index)
          }}
        >
          删除
        </Button>
      </div>
    )
  }

  return (
    <Modal
      title="加价信息"
      visible={isModalVisible}
      onOk={onFinish}
      onCancel={handleCancel}
      getContainer={false}
      width={'70%'}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        name="time_related_controls"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 15 }}
        initialValues={newData}
        scrollToFirstError
        preserve={false}
        style={{
          height: '450px',
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
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="raisePriceArea"
          label="加价区域"
          rules={[
            {
              required: true,
              type: 'array',
              validator: (rule, value, callback) => {
                if (isArray(value)) {
                  const index = (value || []).findIndex(
                    (item) => isUndefined(item.area) || isUndefined(item.price)
                  )
                  index >= 0 && callback('请填写完整的区域与价格！')
                } else if (value === '') {
                  callback('请填写完整的区域与价格！')
                } else {
                  form.setFieldsValue({
                    raisePriceArea: list
                  })
                  callback()
                }
              }
              // message: '请选择加价区域!'
            }
          ]}
        >
          {renderArea()}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ExpressageModal
