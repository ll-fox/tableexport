import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Select,
  Button,
  DatePicker,
  List,
  Typography,
  Input,
  Space
} from 'antd'
import { addWarehouse, fetchWarehouse, destroyWarehouse } from '../../api/sheet'
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
export default function OutboundSheet() {
  const exportDom = useRef(null)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [typeArr, setTypeArr] = useState([])
  const [cost, setCost] = useState(0)
  const [warehouse,setWarehouse] = useState([])
  const [name, setName] = useState('')


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    fetchWarehouse().then((res) => {
        console.log(222,res);
      setWarehouse(res)
    })
  }

  const addItem = (e) => {
    e.preventDefault()
    if (name) {
      addWarehouse(name)
      setName('')
      fetchData()
    }
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

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
    let result = 0
    obj[type] = Number(e.target.textContent)
    let Arr = typeArr.concat()
    Arr[index] = obj
    setTypeArr(Arr)
    typeArr.forEach(item=>{
        result += (item.price || 0) * (item.num || 0)
    })
    setCost(result)
  }
  const ToString = (n) =>{
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)){
        return "数据非法";  //判断数据是否大于0
    }
    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";  
    var indexpoint = n.indexOf('.');  // 如果是小数，截取小数点前面的位数
    if (indexpoint >= 0){
        n = n.substring(0, indexpoint) + n.substr(indexpoint+1, 2);   // 若为小数，截取需要使用的unit单位
    }
    unit = unit.substr(unit.length - n.length);  // 若为整数，截取需要使用的unit单位
    for (var i=0; i < n.length; i++){
        str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);  //遍历转化为大写的数字
    }
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"); // 替换掉数字里面的零字符，得到结果
}
  return (
    <div style={{ background: '#fff' }}>
      <div
        style={{
          width: '70%',
          margin: '0 auto'
        }}
      >
        <List
          size="small"
          header={
            <div
              style={{
                fontSize: '20px',
                color: 'rgb(248, 200, 26)'
              }}
            >
              发货仓库
            </div>
          }
          footer={
            <div>
              <Space
                align="center"
                style={{
                  padding: '0 8px 4px'
                }}
              >
                <Input
                  placeholder="请输入发货仓库"
                  value={name}
                  onChange={onNameChange}
                />
                <Typography.Link
                  onClick={addItem}
                  style={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  <PlusOutlined /> 添加发货仓库
                </Typography.Link>
              </Space>
            </div>
          }
          bordered
          dataSource={warehouse}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              actions={[
                <a
                  key="list-loadmore-edit"
                  onClick={() => {
                    destroyWarehouse(warehouse[index]).then(() => {
                      fetchData()
                    })
                  }}
                >
                  删除
                </a>
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{
            margin: 10
          }}
          type="primary"
          onClick={() => exportPDF('测试导出PDF', exportDom.current)}
        >
          导出PDF
        </Button>
      </div>
      <div
        ref={exportDom}
        style={{
          width: '80%',
          padding: 30,
          boxSizing: 'border-box',
          margin: '0 auto',
          lineHeight: '27px',
          fontSize: 13,
          overflow: 'hidden'
        }}
      >
        <table
          width="95%"
          //   height="30%"
          cellPadding="10"
          cellSpacing="0"
          border="1"
          align="center"
        >
          <tr align="center">
            <th
              style={{
                position: 'relative'
              }}
              colSpan="16"
              bgcolor="lightgray"
            >
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '20px',
                  lineHeight: '50px',
                  fontFamily: 'serif'
                }}
              >
                <img
                  alt="ll"
                  src={'/images/logo.png'}
                  style={{
                    width: '230px',
                    height: '80px',
                    position: 'absolute',
                    left: 0
                  }}
                />
                富平县金翁农业科技有限公司 出库单
              </span>
            </th>
          </tr>

          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              发货仓库
            </td>
            <td width="450" colSpan="4" align="center">
              <Select
                defaultValue={warehouse[0]?.name || ''}
                style={{
                  width: 120
                }}
                bordered={false}
                options={warehouse.map((item) => ({
                  value: item.name,
                  label: item.name
                }))}
              />
            </td>
            <td width="150" colSpan="1" align="center">
              录单日期
            </td>
            <td width="450" colSpan="4" align="center">
              <DatePicker bordered={false} />
            </td>
            <td width="150" colSpan="1" align="center">
              单据编号
            </td>
            <td width="450" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              客户名称
            </td>
            <td width="450" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
            <td width="150" colSpan="1" align="center">
              接货联系人
            </td>
            <td width="450" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
            <td width="150" colSpan="1" align="center">
              接货联系电话
            </td>
            <td width="450" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              送货地址
            </td>
            <td width="150" contentEditable="true" colSpan="14" align="center">
              ....
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              序号
            </td>
            <td width="450" colSpan="4" align="center">
              商品全称
            </td>
            <td width="150" colSpan="1" align="center">
              单位
            </td>
            <td width="150" colSpan="2" align="center">
              数量
            </td>
            <td width="150" colSpan="2" align="center">
              单价
            </td>
            <td width="150" colSpan="2" align="center">
              金额
            </td>
            <td width="450" colSpan="3" align="center">
              备注
            </td>
          </tr>
          {typeArr.map((item, index) => (
            <tr key={index}>
              <td width="150" colSpan="1" align="center">
                {index + 1}
              </td>
              <td
                width="450"
                contentEditable="true"
                colSpan="4"
                align="center"
              ></td>
              <td width="150" colSpan="1" align="center">
                <Select
                  defaultValue="箱"
                  style={{
                    width: 120
                  }}
                  bordered={false}
                  options={[
                    {
                      value: '箱',
                      label: '箱'
                    },
                    {
                      value: '盒',
                      label: '盒'
                    },
                    {
                      value: '斤',
                      label: '斤'
                    }
                  ]}
                />
              </td>
              <td
                width="150"
                colSpan="2"
                contentEditable="true"
                align="center"
                onBlur={(e) => change(e, index, 'num')}
              ></td>
              <td
                width="150"
                contentEditable="true"
                colSpan="2"
                align="center"
                onBlur={(e) => change(e, index, 'price')}
              ></td>
              <td width="150" colSpan="2" align="center">
                {(typeArr[index]?.price || 0) * (typeArr[index]?.num || 0)}
              </td>
              <td
                width="450"
                contentEditable="true"
                colSpan="3"
                align="center"
              ></td>
            </tr>
          ))}
          <tr id="printHide" align="center">
            <th colSpan="16">
              <span
                style={{
                  color: '#f8c81a',
                  border: '13px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => {
                  setTypeArr([...typeArr, {}])
                }}
              >
                + 添加商品
              </span>
            </th>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              合计金额
            </td>
            <td width="150" colSpan="14" align="center">
              {cost}元
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              总计大写
            </td>
            <td width="150" colSpan="14" align="center">
              {ToString(cost)}
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              公司收款账户
            </td>
            <td width="150" colSpan="14">
              单位名称：富平县金翁农业科技有限公司
              <br />
              开户行，中国农业银行富平县支行
              <br />
              开户账号，26555101040019890
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              开票及公司邮箱
            </td>
            <td width="150" colSpan="14">
              yangyifan@jwny.partner.onmschina.cn（请将送货单照片和开票信息发邮箱）
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              公司联系电话及地址
            </td>
            <td width="150" colSpan="14">
              15829000737/陕西省渭南市富平县曹村镇太白村一组
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              公司官网
            </td>
            <td width="150" colSpan="14">
              JWNY.xyz
            </td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              lineHeight: '70px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              收货人签字
            </td>
            <td width="150" contentEditable="true" colSpan="14"></td>
          </tr>
          <tr
            style={{
              fontWeight: '500',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <td width="150" colSpan="1" align="center">
              制表人（签字）
            </td>
            <td width="150" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
            <td width="150" colSpan="1" align="center">
              库管（签字）
            </td>
            <td width="150" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
            <td width="150" colSpan="1" align="center">
              财务（签字）
            </td>
            <td width="150" contentEditable="true" colSpan="4" align="center">
              ....
            </td>
          </tr>
        </table>
      </div>
    </div>
  )
}
