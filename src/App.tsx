import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Navbar, Nav, NavDropdown, Container, Row, Col } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "./App.css";
import * as XLSX from 'xlsx';
import paginationFactory from "react-bootstrap-table2-paginator";
import moment from 'moment';

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true
  },
  {
    dataField: "成交",
    text: "成交日期",
    formatter: (cell: Date) => moment(cell).format('YYYY-MM-DD'),
    sort: true
  },
  {
    dataField: "股票",
    text: "股票",
    sort: true
  },
  {
    dataField: "成交_1",
    text: "成交量",
    sort: true
  },
  { dataField: "價金",
    text: "價金",
    sort: true
  },
  {
    dataField: "手續費",
    text: "手續費",
    sort: true
  },
  {
    dataField: "損益",
    text: "損益",
    sort: true
  }
];

const App: React.FC = props => {
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<object[]>(
    localStorage.getItem("stock") ? JSON.parse(localStorage.getItem("stock") as string): []
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
            const d = data.slice(1, -1).map( (n, i) => ({ id:i, ...n}) );
            setData(d);
            localStorage.setItem('stock', JSON.stringify(d));
        } catch (e) {
            console.error(e);
            return;
        }
      }; // 以二進制方式打開文件
      fileReader.readAsBinaryString(acceptedFiles[0]);
    }
  });
  const fs = files.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));
  return (
    <div className="App">
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
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
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 50, showTotal: true, sizePerPageList: [25, 50, 100, 250, 500] })}
        />
        <Row>
          <Col>
            <section className="container">
              <div {...getRootProps({ className: "dropzone disabled" })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
              <aside>
                <h4>Files</h4>
                <ul>{fs}</ul>
              </aside>
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
