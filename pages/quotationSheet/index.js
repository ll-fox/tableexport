import React, { useRef, useState, useEffect } from 'react'
import App from './../components/Layout/index'
import dynamic from 'next/dynamic'
import { Upload, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const ModalContainer = dynamic(() => import('../../lib/exportPDF'), {
  ssr: false //这个要加上,禁止使用 SSR
})
import { exportPDF } from '../../lib/exportPDF'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })
export default function QuotationSheet() {
  const exportDom = useRef(null)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [typeArr, setTypeArr] = useState([])

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)
  const handleCancel = () => setPreviewOpen(false)

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        上传图片
      </div>
    </div>
  )
  return (
    <App tab={'template'}>
      {/* <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: '100%'
          }}
          src={previewImage}
        />
      </Modal> */}
      <div style={{ background: '#fff' }}>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => exportPDF('测试导出PDF', exportDom.current)}
          >
            导出PDF
          </Button>
        </div>
        <div
          ref={exportDom}
          style={{
            padding: 30,
            boxSizing: 'border-box',
            margin: '0 auto',
            lineHeight: '30px',
            fontSize: 14,
            overflow: 'hidden'
          }}
        >
          <table
            width="90%"
            height="30%"
            cellPadding="5px"
            cellSpacing="0"
            border="1"
            align="center"
          >
            <tr align="center">
              <th
                style={{
                  position: 'relative'
                }}
                width="100"
                colSpan="16"
                bgcolor="lightgray"
              >
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontFamily: 'serif'
                  }}
                >
                  <img
                    alt="ll"
                    src={'/images/logo.png'}
                    style={{
                      width: '182px',
                      height: '64px',
                      position: 'absolute',
                      left: 0
                    }}
                  />
                  金翁农业报价拆分单据
                </span>
              </th>
            </tr>

            <tr
              style={{
                lineHeight: '15px'
              }}
            >
              <td width="100" align="center">
                规格名称
              </td>
              <td width="100" align="center">
                产品产地收购价格
                <br />
                （元/斤）
              </td>
              <td width="100" align="center">
                净重（斤）
              </td>
              <td width="100" align="center">
                计算损耗后原材料价格 <br />
                （5%计算）
              </td>
              <td width="100" align="center">
                外箱成本（元）
              </td>
              <td width="100" align="center">
                吸塑盒成本
              </td>
              <td width="100" align="center">
                泡沫箱成本
              </td>
              <td width="100" align="center">
                胶带
              </td>
              <td width="100" align="center">
                人工打包费用
              </td>
              <td width="100" align="center">
                快递费用 <br />（
                <span contentEditable="true">顺丰快递(可编辑)</span>）
              </td>
              <td width="100" align="center">
                人工搬运费用
              </td>
              <td width="100" align="center">
                客服成本
              </td>
              <td width="100" align="center">
                场地其他费用
              </td>
              <td width="100" align="center">
                成本价格
              </td>
              <td width="100" align="center">
                利润
              </td>
              <td width="100" align="center">
                对外报价
              </td>
            </tr>
            {typeArr.map((item, index) => (
              <tr key={index}>
                <td width="100" colSpan="1" align="center">
                  {`规格名称${index + 1}`}
                </td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
                <td width="100" colSpan="1" align="center"></td>
              </tr>
            ))}
            <tr id="printHide" width="100" align="center">
              <th width="100" colSpan="16">
                <span
                  style={{
                    color: '#1890ff',
                    border: '1px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '300'
                  }}
                  onClick={() => {
                    setTypeArr([...typeArr, {}])
                  }}
                >
                  + 添加
                </span>
              </th>
            </tr>
            <tr align="center">
              <th colSpan="16" bgcolor="lightgray">
                快递
              </th>
            </tr>
            <tr>
              <td width="100" colSpan="2" align="center">
                快递名称
              </td>
              <td width="100" colSpan="14" align="center">
                ...
              </td>
            </tr>
            <tr>
              <td width="100" colSpan="2" align="center">
                不发货区域
              </td>
              <td width="100" colSpan="14" align="center">
                ...
              </td>
            </tr>
            <tr>
              <td width="100" height="18" colSpan="2" align="center">
                发货地
              </td>
              <td width="100" height="18" colSpan="2" align="center">
                陕西·富平
              </td>
              <td width="100" rowSpan="2" colSpan="1" align="center">
                发货时间
              </td>
              <td width="100" rowSpan="2" colSpan="1" align="center">
                48小时
              </td>
              <td width="100" rowSpan="2" colSpan="2" align="center">
                日发货最大单
              </td>
              <td width="100" rowSpan="2" colSpan="1" align="center">
                10000单
              </td>
              <td width="100" rowSpan="2" colSpan="2" align="center">
                发票类型
              </td>
              <td width="100" rowSpan="2" colSpan="2" align="center">
                增值税专用发票
              </td>
              <td width="100" rowSpan="2" colSpan="1" align="center">
                包装图
              </td>
              <td width="100" rowSpan="2" colSpan="2" align="center">
                <span>
                  <Upload
                    listType="picture-card"
                    accept=".jpg, .jpeg, .png"
                    fileList={fileList}
                    // onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </span>
              </td>
            </tr>
            <tr>
              <td width="100" height="18" colSpan="2" align="center">
                产地
              </td>
              <td width="100" height="18" colSpan="2" align="center">
                陕西·大荔
              </td>
            </tr>
          </table>
        </div>
      </div>
    </App>
  )
}
