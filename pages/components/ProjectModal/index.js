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
import moment from 'moment'
import { cloneDeep, isEmpty, isArray, isUndefined } from 'lodash'
import { addProject, updateProject } from '../../api/project'
const { Option } = Select

const ProjectModal = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const { handleFinish, handleCancel, isModalVisible, data } = props
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
        values.sale = 0
        values.expend = 0
        values.weight = 0
        addProject(values).then((res) => {
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
        updateProject(values, data.objectId).then((res) => {
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

  return (
    <Modal
      title="项目信息"
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
          name="projectName"
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
          name="address"
          label="项目地址"
          rules={[
            {
              required: true,
              message: '请输入项目地址!'
            }
          ]}
        >
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="auditor"
          label="负责人"
          rules={[
            {
              required: true,
              message: '请选择负责人!'
            }
          ]}
        >
          <Select style={{ width: 250 }}>
            {['杨一凡', '石喆', '王宝亮'].map((name) => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProjectModal
