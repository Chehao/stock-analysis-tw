import React, { useState, useEffect } from "react";
import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useDropzone } from "react-dropzone";
import * as XLSX from 'xlsx';
import "./App.css";
import { columns } from "./AppColum";
import * as _ from 'lodash';

const rowClasses = (row: { 損益: number}, rowIndex: number) => {
  // if (row.損益 > 0) {
  //   return 'stock-raise'
  // } else if (row.損益 < 0) {
  //   return 'stock-fall'
  // }
  return ''
};
/*
  {
    "id": 0,
    "成交": "2019-12-23T16:00:00.000Z",
    "股票": "[2882]國泰金",
    "交易": "整股",
    "買賣別": "買",
    "交易_1": "現股",
    "成交_1": 1000,
    "成交價": 46.7,
    "價金": 46700,
    "手續費": 39,
    "交易稅": 0,
    "應收": -46739,
    "融資金額": 0,
    "自備款": 0,
    "融資券": 0,
    "融券": 0,
    "標借費": 0,
    "利息": 0,
    "二代健保": 0,
    "損益": 0,
    "交割日": "2019-12-25T16:00:00.000Z",
    "幣別": "新台幣"
  },
*/
const App: React.FC = props => {
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<object[]>(
    localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("stock") as string): []
  );
  const [groupData, setGroupData] = useState<{[key: string]: any}>(
    localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("group-stock") as string): {}
  );
  const { getRootProps, getInputProps } = useDropzone({
    disabled: false,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      ));
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        try {
            const result = event.target!.result; // 以二進制流方式讀取得到整份excel表格對象
            const workbook = XLSX.read(result, { type: "binary", cellDates: true });
            let data: object[] = [];
            for (const sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    // 利用 sheet_to_json 方法將 excel 轉成 json 數據
                    console.log(sheet);
                    data = data.concat(
                        XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                    ); // break; // 如果只取第一張表，就取消註釋這行
                }
            }
            const newData = data.slice(1, -1).map( (n, i) => ({ id:i, ...n}) );
            const newGroupData = _.chain(newData).groupBy('股票').mapValues((v: {買賣別: string, 成交_1: number}[]) => {
              const totalShares = v.filter((r: {買賣別: string, 成交_1: number}) => (r["買賣別"] === "買")).map(n => n["成交_1"]).reduce((sum, x) => sum + x) - 
                v.filter((r: {買賣別: string, 成交_1: number}) => (r["買賣別"] === "賣")).map(n => n["成交_1"]).reduce((sum, x) => sum + x, 0)
              return {
                "明細": v,
                "股數": totalShares
              }  
            }).value();
            console.log(newGroupData)
            setData(newData);
            setGroupData(newGroupData)
            localStorage.setItem('stock', JSON.stringify(newData));
            localStorage.setItem('group-stock', JSON.stringify(newGroupData));
        } catch (e) {
            console.error(e);
            return;
        }
      }; // 以二進制方式打開文件
      fileReader.readAsBinaryString(acceptedFiles[0]);
    }
  });
  // const fs = files.map(file => (
  //   <li key={file.name}>
  //     {file.name} - {file.size} bytes
  //   </li>
  // ));
  useEffect(() => {
    console.log("useEffect");
    groupData && Object.keys(groupData).forEach((key) => {
      console.log(key);
      const stockNo = key.split("]")[0].split("[")[1]
      console.log()
      const url = `/stock/api/getStockInfo.jsp?ex_ch=tse_${stockNo}.tw&json=1&delay=0&_=`;
      fetch(url, {
      }).then((response) => response.json())
      .then(data => {
        console.log(data.msgArray[0].z);
        groupData[key]["市價"] = data.msgArray[0].z
      }).catch(e => {
        console.error("error on" + key);
      })
      ;
      // var response = UrlFetchApp.fetch(url);
      // var json = response.getContentText("UTF-8");
      // var data = JSON.parse(json);
      // return data.msgArray[0].z;
    });
  }, [groupData]);

  return (
    <div className="App">
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Navbar.Brand href="#home">元大投資xlsx匯入</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <BootstrapTable
          classes="table-sm"
          bootstrap4
          keyField="id"
          data={data}
          bordered={false}
          hover
          columns={columns}
          rowClasses={rowClasses}
          pagination={paginationFactory({ sizePerPage: 50, showTotal: true, sizePerPageList: [25, 50, 100, 250, 500] })}
        />
        <Row>
          <Col>
            <section className="container">
              <div {...getRootProps({ className: "dropzone disabled" })}>
                <input {...getInputProps()} />
                <p>拖拉Excel匯入資料</p>
              </div>
              {/* <aside>
                <h4>Files</h4>
                <ul>{fs}</ul>
              </aside> */}
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
