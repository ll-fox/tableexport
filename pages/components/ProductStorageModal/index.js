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
import {
  updateProductStorage,
  addProductStorage
} from '../../api/productStorage'
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

const ProductStorageModal = (props) => {
  const [form] = Form.useForm()
  const { handleReplyFinish, handleCancel, isModalVisible, data, items } = props
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
      values.date = values.date.format('YYYY-MM-DD')
      values.material = values.material.map((item) => item.url)
      let price = 0
      ;(values.total || []).forEach((item) => {
        price += item.unitPrice * item.num
      })
      values.price = (price * 100) / 100

      if (isEmpty(data)) {
        addProductStorage(values).then((res) => {
          if (res) {
            setLoading(false)
            message.success('保存成功！')
            form.resetFields()
            handleReplyFinish()
          } else {
            setLoading(false)
            message.error('修改失败！')
          }
        })
      } else {
        updateProductStorage(values, data.objectId).then((res) => {
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

  const setProductData = (value, type, index) => {
    list[index][type] = value
    form.setFieldsValue({
      total: [...list]
    })
    setList([...list])
  }

  const addRenderProduct = () => {
    setList([...list, {}])
  }

  const deleteProduct = (index) => {
    list.splice(index, 1)
    setList([...list])
  }

  const renderTotal = () => {
    return (
      <div>
        {list && list.map((item, index) => renderTotalItem(item, index))}
        <Button type="primary" onClick={addRenderProduct}>
          添加商品
        </Button>
      </div>
    )
  }

  const renderTotalItem = (item, index) => {
    return (
      <div style={{ display: 'flex', marginBottom: '2px' }}>
        <Input
          placeholder="产品名称"
          size="small"
          value={item.productType}
          style={{
            marginRight: '2px'
          }}
          onChange={(e) => setProductData(e.target.value, 'productType', index)}
        />
        <Input
          size="small"
          placeholder="规格"
          value={item.specification}
          style={{
            marginRight: '2px'
          }}
          onChange={(e) =>
            setProductData(e.target.value, 'specification', index)
          }
        />
        <Input
          size="small"
          placeholder="预计使用规格"
          value={item.planSpecification}
          style={{
            marginRight: '2px'
          }}
          onChange={(e) =>
            setProductData(e.target.value, 'planSpecification', index)
          }
        />
        <InputNumber
          placeholder="数量"
          value={item.num}
          style={{
            marginRight: '2px',
            width: '35%'
          }}
          onChange={(val) => setProductData(val, 'num', index)}
          min={0}
        />
        <InputNumber
          placeholder="单价"
          value={item.unitPrice}
          style={{
            width: '35%'
          }}
          onChange={(val) => setProductData(val, 'unitPrice', index)}
          min={0}
        />
        <Button
          danger
          type="text"
          onClick={() => {
            deleteProduct(index)
          }}
        >
          删除
        </Button>
      </div>
    )
  }

  return (
    <Modal
      title="请填写入库信息"
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
          name="supplierName"
          label="供应商名称"
          rules={[
            {
              type: 'string',
              required: true,
              message: '请输入供应商名称!'
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
          name="total"
          label="商品信息"
          rules={[
            {
              required: true,
              type: 'array',
              validator: (rule, value, callback) => {
                if (isEmpty(value)) {
                  callback('请填写完整的商品信息！')
                } else if (isArray(value)) {
                  const index = (value || []).findIndex(
                    (item) =>
                      isUndefined(item.productType) ||
                      isUndefined(item.specification) ||
                      isUndefined(item.planSpecification) ||
                      isUndefined(item.num) ||
                      isUndefined(item.unitPrice)
                  )
                  index >= 0 && callback('请填写完整的商品信息！')
                  callback()
                } else if (value === '') {
                  callback('请填写完整的商品信息！')
                } else {
                  form.setFieldsValue({
                    total: list
                  })
                  callback()
                }
              }
              // message: '请选择加价区域!'
            }
          ]}
        >
          {renderTotal()}
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
            {['杨一凡', '米佳乐', '石喆'].map((name) => (
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
            {['杨一凡', '米佳乐', '石喆'].map((name) => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="payWay"
          label="付款方式"
          rules={[
            {
              required: true,
              message: '请选择付款方式!'
            }
          ]}
        >
          <Select style={{ width: 250 }}>
            <Option value="日结">日结</Option>
            <Option value="月结">月结</Option>
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
              required: true,
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

export default ProductStorageModal
