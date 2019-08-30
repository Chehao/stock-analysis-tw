import React from "react";
import {
  Button,
  Form,
  InputGroup,
  Navbar,
  Nav,
  NavDropdown,
  Container
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "./App.css";

const products: { id: string; name: string; price: number }[] = [
  { id: "1", name: "hihi", price: 223 },
  { id: "2", name: "hihi", price: 223 },
  { id: "3", name: "hihi", price: 223 },
  { id: "4", name: "hihi", price: 223 },
  { id: "5", name: "hihi", price: 223 },
  { id: "6", name: "hihi", price: 223 },
  { id: "7", name: "hihi", price: 223 }
];
const columns = [
  {
    dataField: "id",
    text: "Product ID",
    sort: true
  },
  {
    dataField: "name",
    text: "Product Name",
    sort: true
  },
  {
    dataField: "price",
    text: "Product Price"
  }
];
const App: React.FC = () => {
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
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">Upload</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="file" placeholder="Enter email" />
            <InputGroup.Append>
              <Button>Browse</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>

        <BootstrapTable
          bootstrap4
          keyField="id"
          data={products}
          columns={columns}
        />
      </Container>
    </div>
  );
};

export default App;
