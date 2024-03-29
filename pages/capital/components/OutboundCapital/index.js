import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Modal } from 'antd'
import ExportJsonExcel from 'js-export-excel'
import {
  fetchOutTemplateInfo,
  destroyOutTemplateInfo
} from '../../../api/sheet'
const { confirm } = Modal

const ExpressageCapital = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    fetchOutTemplateInfo().then((res) => {
      setData([...res])
      setLoading(false)
    })
  }

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 130
    },
    {
      title: '单据编号',
      dataIndex: 'id',
      key: 'id',
      width: 130
    },
    {
      title: '发货仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 200
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      width: 130,
      key: 'customer'
    },
    {
      title: '总重量',
      dataIndex: 'weight',
      width: 130,
      key: 'weight'
    },
    {
      title: '合计金额',
      dataIndex: 'cost',
      width: 130,
      key: 'cost'
    },
    {
      title: '收款账号',
      dataIndex: 'account',
      key: 'name',
      width: 150
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 150,
      render: (_, re) => {
        return(
        <a
          onClick={() => {
            Modal.confirm({
              title: '删除',
              content: '是否确认删除？',
              onOk: () => {
                setLoading(true)
                destroyOutTemplateInfo(re).then(()=>{
                    fetchData()
                })
              },
              onCancel() {}
            })
          }}
        >
          删除
        </a>
      )}
    }
  ]


  const exportTable = () => {
    let sheetFilter = [
      'date',
      'id',
      'warehouse',
      'customer',
      'weight',
      'cost',
      'account',
    ]
    let option = {}
    option.fileName = '出库信息表'
    option.datas = [
      {
        sheetData: data,
        sheetName: '出库信息表',
        sheetFilter: sheetFilter,
        sheetHeader: [
          '日期',
          '单据编号',
          '发货仓库',
          '客户名称',
          '总重量',
          '合计金额',
          '收款账号'
        ],
        columnWidths: [10, 10, 10, 10, 10, 10,20]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //保存
  }

  return (
    <div>
      <div>
        {/* <Button type="primary" onClick={() => showModal({})}>
          新增+
        </Button> */}
        <Button type="primary" onClick={exportTable} danger ghost>
          导出
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          total: data.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        // scroll={{ y: 'calc(100vh - 320px)', x: 2200 }}
        // onChange={onChange}
      />
    </div>
  )
}

export default ExpressageCapital
