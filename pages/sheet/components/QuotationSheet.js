import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Upload, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const ModalContainer = dynamic(() => import('../../../lib/exportPDF'), {
  ssr: false //这个要加上,禁止使用 SSR
})
import { exportPDF } from '../../../lib/exportPDF'

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
  const [areaArr, setAreaArr] = useState([])
  const [loss, setLoss] = useState(5)
  let cost = ''

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

  const change = (e, index, type) => {
    let obj = typeArr[index] || {}
    obj[type] = Number(e.target.textContent)
    let Arr = typeArr.concat()
    Arr[index] = obj
    setTypeArr(Arr)
    cost =
      (typeArr[index]?.price || 0) *
        (typeArr[index]?.num || 0) *
        (loss / 100 + 1) +
      (typeArr[index]?.pack || 0) +
      (typeArr[index]?.place || 0) +
      (typeArr[index]?.other || 0) +
      (typeArr[index]?.other1 || 0) +
      (typeArr[index]?.tape || 0) +
      (typeArr[index]?.human || 0) +
      (typeArr[index]?.expressage || 0) +
      (typeArr[index]?.carry || 0) +
      (typeArr[index]?.service || 0) +
      (typeArr[index]?.place || 0)
    console.log(1111, e.target.textContent, cost)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={
          {
            // marginTop: 8
          }
        }
      >
        上传图片
      </div>
    </div>
  )
  console.log(333, typeArr)
  return (
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
                lineHeight: '15px',
                fontWeight: '500',
                fontSize: '13px'
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
                计算损耗后原材料价格 <br />（
                <span
                  style={{
                    fontSize: '15px',
                    color: 'rgb(215 175 95)'
                  }}
                  contentEditable="true"
                  onBlur={(e) => {
                    const value = Number(e.target.textContent)
                    setLoss(value)
                  }}
                >
                  5
                </span>
                %计算）
              </td>
              <td width="100" align="center">
                外箱成本（元）
              </td>
              <td contentEditable="true" width="100" align="center">
                其他成本1
              </td>
              <td contentEditable="true" width="100" align="center">
                其他成本2
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
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                >
                  {`规格名称${index + 1}`}
                </td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'price')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'num')}
                ></td>
                <td
                  // contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                >
                  {(typeArr[index]?.price || 0) *
                    (typeArr[index]?.num || 0) *
                    (loss / 100 + 1)}
                </td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'pack')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'other')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'other1')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'tape')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'human')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'expressage')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'carry')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'service')}
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'place')}
                ></td>
                <td width="100" colSpan="1" align="center">
                  {(typeArr[index]?.price || 0) *
                    (typeArr[index]?.num || 0) *
                    (loss / 100 + 1) +
                    (typeArr[index]?.pack || 0) +
                    (typeArr[index]?.place || 0) +
                    (typeArr[index]?.other || 0) +
                    (typeArr[index]?.other1 || 0) +
                    (typeArr[index]?.tape || 0) +
                    (typeArr[index]?.human || 0) +
                    (typeArr[index]?.expressage || 0) +
                    (typeArr[index]?.carry || 0) +
                    (typeArr[index]?.service || 0) +
                    (typeArr[index]?.place || 0)}
                </td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                >
                  {(typeArr[index]?.offer || 0) -
                    ((typeArr[index]?.price || 0) *
                      (typeArr[index]?.num || 0) *
                      (loss / 100 + 1) +
                      (typeArr[index]?.pack || 0) +
                      (typeArr[index]?.place || 0) +
                      (typeArr[index]?.other || 0) +
                      (typeArr[index]?.other1 || 0) +
                      (typeArr[index]?.tape || 0) +
                      (typeArr[index]?.human || 0) +
                      (typeArr[index]?.expressage || 0) +
                      (typeArr[index]?.carry || 0) +
                      (typeArr[index]?.service || 0) +
                      (typeArr[index]?.place || 0))}
                </td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="1"
                  align="center"
                  onBlur={(e) => change(e, index, 'offer')}
                ></td>
              </tr>
            ))}
            <tr id="printHide" width="100" align="center">
              <th width="100" colSpan="16">
                <span
                  style={{
                    color: '#f8c81a',
                    border: '1px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onClick={() => {
                    setTypeArr([...typeArr, {}])
                  }}
                >
                  + 添加规格
                </span>
              </th>
            </tr>
            <tr align="center">
              <th
                style={{
                  fontFamily: 'serif',
                  fontWeight: '800'
                }}
                colSpan="16"
                bgcolor="lightgray"
              >
                快递
              </th>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                colSpan="2"
                align="center"
              >
                快递名称
              </td>
              <td
                contentEditable="true"
                width="100"
                colSpan="14"
                align="center"
              >
                ...
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                colSpan="2"
                align="center"
              >
                不发货区域
              </td>
              <td
                contentEditable="true"
                width="100"
                colSpan="14"
                align="center"
              >
                ...
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                colSpan="2"
                align="center"
              >
                加价区域
              </td>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                colSpan="7"
                align="center"
              >
                规格
              </td>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                colSpan="7"
                align="center"
              >
                加价（元）
              </td>
            </tr>
            {areaArr.map((item, index) => (
              <tr key={index}>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="2"
                  align="center"
                >
                  地区{index + 1}
                </td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="7"
                  align="center"
                ></td>
                <td
                  contentEditable="true"
                  width="100"
                  colSpan="7"
                  align="center"
                ></td>
              </tr>
            ))}
            <tr id="printHide" width="100" align="center">
              <th width="100" colSpan="16">
                <span
                  style={{
                    color: '#f8c81a',
                    border: '1px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onClick={() => {
                    setAreaArr([...areaArr, {}])
                  }}
                >
                  + 添加加价区域
                </span>
              </th>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                height="18"
                colSpan="2"
                align="center"
              >
                发货地
              </td>
              <td
                contentEditable="true"
                width="100"
                height="18"
                colSpan="2"
                align="center"
              >
                ......
              </td>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                rowSpan="2"
                colSpan="1"
                align="center"
              >
                发货时间
              </td>
              <td
                contentEditable="true"
                width="100"
                rowSpan="2"
                colSpan="1"
                align="center"
              >
                .......
              </td>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                rowSpan="2"
                colSpan="2"
                align="center"
              >
                日发货最大单
              </td>
              <td
                contentEditable="true"
                width="100"
                rowSpan="2"
                colSpan="1"
                align="center"
              >
                ........
              </td>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                rowSpan="2"
                colSpan="2"
                align="center"
              >
                发票类型
              </td>
              <td
                contentEditable="true"
                width="100"
                rowSpan="2"
                colSpan="2"
                align="center"
              >
                ........
              </td>
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                rowSpan="2"
                colSpan="1"
                align="center"
              >
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
              <td
                style={{
                  fontWeight: '500'
                }}
                width="100"
                height="18"
                colSpan="2"
                align="center"
              >
                产地
              </td>
              <td
                contentEditable="true"
                width="100"
                height="18"
                colSpan="2"
                align="center"
              >
                ......
              </td>
            </tr>
          </table>
        </div>
      </div>
  )
}
