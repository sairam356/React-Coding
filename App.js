import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Chart } from 'react-google-charts';
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Dropdown,
  DropdownButton,
  Navbar,
  Table,
  Spinner
} from 'react-bootstrap';

const App = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [productFilter, setProductFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [chartData, setChartData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Simulate an API call to fetch data
    const fetchData = async () => {
      setLoading(true);
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve([
          { id: 1, product: 'Product A', status: 'Open', action: 'Action 1' },
          { id: 2, product: 'Product B', status: 'Closed', action: 'Action 2' },
          { id: 3, product: 'Product C', status: 'Pending', action: 'Action 3' }
        ]), 1000)
      );
      setTableData(data);
      setFilteredData(data);
      prepareChartData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [productFilter, statusFilter, actionFilter]);

  const filterData = () => {
    let filtered = tableData;

    if (productFilter !== 'All') {
      filtered = filtered.filter(row => row.product === productFilter);
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter(row => row.status === statusFilter);
    }
    if (actionFilter !== 'All') {
      filtered = filtered.filter(row => row.action === actionFilter);
    }

    setFilteredData(filtered);
    prepareChartData(filtered);
  };

  const handleProductFilterChange = (product) => setProductFilter(product);
  const handleStatusFilterChange = (status) => setStatusFilter(status);
  const handleActionFilterChange = (action) => setActionFilter(action);

  const prepareChartData = (data) => {
    const productCounts = data.reduce((acc, row) => {
      acc[row.product] = (acc[row.product] || 0) + 1;
      return acc;
    }, {});

    const chartData = [['Product', 'Count']];
    Object.keys(productCounts).forEach((key) => {
      chartData.push([key, productCounts[key]]);
    });

    setChartData(chartData);
  };

  return (
    <>
      <div className="app-background">
        <Container fluid>
          <Row>
            <Col>
              <Navbar className="bg-dark text-white justify-content-center py-3">
                <Navbar.Brand href="#home" className="text-white">Self Healing Engine</Navbar.Brand>
              </Navbar>
            </Col>
          </Row>
        </Container>
        <br />
        <Container fluid="md">
          <Row>
            <Col className="text-center mb-3">
              <DropdownButton
                id="dropdown-product-filter"
                title={`Filter by Product: ${productFilter}`}
                onSelect={handleProductFilterChange}
                className="d-inline-block mx-2"
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Product A">Product A</Dropdown.Item>
                <Dropdown.Item eventKey="Product B">Product B</Dropdown.Item>
                <Dropdown.Item eventKey="Product C">Product C</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col className="text-center mb-3">
              <DropdownButton
                id="dropdown-status-filter"
                title={`Filter by Status: ${statusFilter}`}
                onSelect={handleStatusFilterChange}
                className="d-inline-block mx-2"
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Open">Open</Dropdown.Item>
                <Dropdown.Item eventKey="Closed">Closed</Dropdown.Item>
                <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col className="text-center mb-3">
              <DropdownButton
                id="dropdown-action-filter"
                title={`Filter by Action: ${actionFilter}`}
                onSelect={handleActionFilterChange}
                className="d-inline-block mx-2"
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Action 1">Action 1</Dropdown.Item>
                <Dropdown.Item eventKey="Action 2">Action 2</Dropdown.Item>
                <Dropdown.Item eventKey="Action 3">Action 3</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </Container>
        <br />
        <Container fluid="md">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">ENDB</span>
              </Spinner>
            </div>
          ) : (
            <>
              <Table responsive striped bordered hover variant="light" className="table-custom">
                <thead className="text-center">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th onClick={handleShow} style={{ cursor: 'pointer' }}>Analytics</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.product}</td>
                      <td>{row.status}</td>
                      <td>{row.action}</td>
                      <td onClick={handleShow} style={{ cursor: 'pointer' }}>Analytics</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Container fluid="md" className="my-4 text-center">
                <h4>Product Distribution</h4>
                <Chart
                  width={'100%'}
                  height={'300px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart...</div>}
                  data={chartData}
                  options={{
                    title: 'Product Distribution',
                    pieHole: 0.4,
                    backgroundColor: 'transparent',
                    legend: { position: 'bottom' },
                    chartArea: { width: '80%', height: '70%' }
                  }}
                />
              </Container>
            </>
          )}
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100">Modal Heading</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">Woohoo, you are reading this text in a modal!</Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Navbar fixed="bottom" bg="dark" className="justify-content-center text-white py-3">
          Powered by Challengers Team
        </Navbar>
      </div>
    </>
  );
};

export default App;
