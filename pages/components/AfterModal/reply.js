import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Modal,
  List,
  message,
  Typography,
  Divider,
  Timeline
} from 'antd'
import 'moment/locale/zh-cn'
import { updateItem } from '../../api/aftersales'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
const { TextArea } = Input

const ReplyModal = (props) => {
  const [form] = Form.useForm()
  const { handleReplyFinish, handleCancel, isModalVisible, data } = props
  const [loading, setLoading] = useState(false)

  const newData = cloneDeep(data)
  const onFinish = () => {
    form.validateFields().then((values) => {
      const obj = {
        text: values.replyReason,
        name: values.replyName,
        time: moment().format('YYYY-MM-DD HH:mm')
      }
      setLoading(true)
      newData.reasonList = [...newData.reasonList, obj]
      newData.reason = values.replyReason
      delete newData.objectId
      delete newData.updatedAt
      delete newData.createdAt
      if (!isEmpty(data)) {
        updateItem(newData, data.objectId).then((res) => {
          if (res) {
            setLoading(false)
            message.success('回复成功！')
            form.resetFields()
            handleReplyFinish()
          } else {
            setLoading(false)
            message.error('回复失败！')
          }
        })
      }
    })
  }

  return (
    <Modal
      title="请填写回复信息"
      visible={isModalVisible}
      onOk={onFinish}
      onCancel={handleCancel}
      getContainer={false}
      width={'60%'}
      destroyOnClose
      confirmLoading={loading}
    >
      <div
        style={{
          height: '450px',
          overflow: 'auto'
        }}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
          <Form.Item style={{ marginBottom: '3px' }} label="平台">
            {newData.platform}
          </Form.Item>
          <Form.Item style={{ marginBottom: '3px' }} label="收件人">
            {newData.username}
          </Form.Item>
          <Form.Item style={{ marginBottom: '3px' }} label="快递">
            {newData.expressage}
          </Form.Item>
        </Form>
        <Divider>回复历史</Divider>
        <Timeline mode="right">
          {(newData.reasonList || []).map((item, index) => (
            <Timeline.Item
              key={index}
              label={`${item.name || '处理人暂无'} ${item.time || '时间暂无'}`}
            >
              {item.text}
            </Timeline.Item>
          ))}
        </Timeline>
        <Form
          form={form}
          name="time_related_controls"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          initialValues={newData}
          preserve={false}
        >
          <Form.Item
            name="replyReason"
            label="回复内容"
            rules={[
              {
                type: 'string',
                required: true,
                message: '请输入回复内容!'
              }
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="replyName"
            label="回复人"
            rules={[
              {
                type: 'string',
                required: true,
                message: '请输入回复人!'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default ReplyModal
