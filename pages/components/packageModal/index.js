import React, { useState, useEffect } from 'react'
import {
  Form,
  DatePicker,
  Input,
  Modal,
  InputNumber,
  message,
  Button,
  Select,
  Upload
} from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
const AV = require('leancloud-storage')
import { addPackage, updatePackage } from '../../api/package'
import moment from 'moment'
import { cloneDeep, isEmpty, isArray, isUndefined } from 'lodash'
const { TextArea } = Input
const { Option } = Select

const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: '请选择时间!'
    }
  ]
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const PackageModal = (props) => {
  const [form] = Form.useForm()
  const {
    handleReplyFinish,
    handleCancel,
    isModalVisible,
    data,
    selectProject
  } = props
  const newData = cloneDeep(data)
  if (!isEmpty(data)) {
    newData.date = moment(data.date)
    newData.rePriceDate = data.rePriceDate ? moment(data.rePriceDate) : ''
    newData.material = newData.material.map((item, index) => {
      return {
        uid: index,
        name: 'image.png',
        status: 'done',
        url:
          item ||
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fb7b5b489ab8adb866af91fee3019886c5389ff9d67ab-hH0Mm2_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659110343&t=fa34dd0b42d2ebd9b69b467164e60d9a'
      }
    })
  }
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState(newData?.material || [])
  const [list, setList] = useState([])
  const [isDsable, setIsDsable] = useState(false)

  useEffect(() => {
    if (!isEmpty(data)) {
      setList(data?.total)
    }
  }, [data])

  useEffect(() => {
    form.setFieldsValue({
      total: list
    })
  }, [form, list])

  const onFinish = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      values.projectId = selectProject
      values.date = values.date.format('YYYY-MM-DD')
      values.material = (values?.material || []).map((item) => item.url)
      values.inventory = values.amount

      if (isEmpty(data)) {
        addPackage(values).then((res) => {
          if (res) {
            setLoading(false)
            message.success('保存成功！')
            form.resetFields()
            handleReplyFinish()
          } else {
            setLoading(false)
            message.error('保存失败，因为该包装名称已经存在！')
          }
        })
      } else {
        updatePackage(values, data.objectId).then((res) => {
          if (res) {
            setLoading(false)
            message.success('修改成功！')
            form.resetFields()
            handleReplyFinish()
          } else {
            setLoading(false)
            message.error('修改失败！')
          }
        })
      }
    })
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }

    return e?.fileList.map((item) => item.originFileObj)
  }

  const handleChange = ({ file, fileList: newFileList }) => {
    file.status = 'uploading'
    setIsDsable(true)
    return setFileList(newFileList)
  }

  const beforeUpload = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file)
    }
    const data = { base64: file.preview }
    const files = new AV.File(file.name, data)
    files.save().then(
      (value) => {
        file.status = 'done'
        setIsDsable(false)
        file.url = value.url()
        setFileList([file])
        return true
      },
      (error) => {
        file.status === 'error'
        // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        message.error('上传失败!')
        return false
      }
    )
  }

  return (
    <Modal
      title="请填写包装信息"
      visible={isModalVisible}
      onOk={onFinish}
      onCancel={handleCancel}
      getContainer={false}
      width={'80%'}
      destroyOnClose
      confirmLoading={loading}
      okButtonProps={{
        disabled: isDsable
      }}
    >
      <Form
        form={form}
        name="time_related_controls"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={newData}
        preserve={false}
        style={{
          height: '450px',
          overflow: 'auto'
        }}
      >
        <Form.Item name="date" label="日期" {...config}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="packageName"
          label="包装名称"
          rules={[
            {
              required: true,
              message: '请输入包装名称!'
            }
          ]}
        >
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="specification"
          label="规格"
          rules={[
            {
              required: true,
              message: '请输入规格!'
            }
          ]}
        >
          <InputNumber addonAfter="斤" />
        </Form.Item>
        <Form.Item
          name="amount"
          label="数量"
          rules={[
            {
              required: true,
              message: '请输入数量!'
            }
          ]}
        >
          <InputNumber addonAfter="件" />
        </Form.Item>
        <Form.Item
          name="packagePrice"
          label="金额"
          rules={[
            {
              required: true,
              message: '请输入金额!'
            }
          ]}
        >
          <InputNumber addonAfter="元" />
        </Form.Item>
        <Form.Item
          name="auditor"
          label="进库审核人"
          rules={[
            {
              required: true,
              message: '请选择进库审核人!'
            }
          ]}
        >
          <Select style={{ width: 250 }}>
            {['杨一凡', '王宝亮', '石喆'].map((name) => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="payAuditor"
          label="付款审核人"
          rules={[
            {
              required: true,
              message: '请选择付款审核人!'
            }
          ]}
        >
          <Select style={{ width: 250 }}>
            {['杨一凡', '贺海燕', '石喆'].map((name) => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="pay"
          label="是否付款"
          rules={[
            {
              required: true,
              message: '请选择是否付款!'
            }
          ]}
        >
          <Select style={{ width: 250 }}>
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea
            style={{
              width: '55%'
            }}
          />
        </Form.Item>
        <Form.Item
          name="material"
          label="证明材料"
          // valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              type: 'array',
            //   required: true,
              message: '请上传证明材料!'
            }
          ]}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
        >
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            style={{
              width: '50%'
            }}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              点击上传
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PackageModal
