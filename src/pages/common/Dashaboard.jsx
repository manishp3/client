import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';

import ProductCard from '../../component/ProductCard';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { CiLogout } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/slices/authSlice';
import LogoutConfirmationModal from '../../component/client/LogoutConfirmationModal';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const isClient = user?.role === 'client';
  console.log("rolerolerolerolerole", user);

  useEffect(() => {
    if (products && products.length > 0) {
      setFilteredProducts(products)
    }
  }, [products,isClient])

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleManageProducts = () => {
    navigate('/manage-products');
  };

  useEffect(() => {
    // if (searchTerm != "") {
    if (!searchTerm || searchTerm == '') {
      return setFilteredProducts(products)
    }
    const timer = setTimeout(() => {
      const filteredProd = products.filter((data) => data.name.toLowerCase().includes(searchTerm.toLowerCase()) || data.category.toLowerCase().includes(searchTerm.toLowerCase()))
      console.log("log of searc debounce::", filteredProd);
      setFilteredProducts(filteredProd)

    }, 500);
    return () => clearTimeout(timer)
    // }
    // else {

    // }
  }, [searchTerm, products])
  const handleLogout = async () => {

    await dispatch(logoutUser()).unwrap()

    navigate("/login")
    window.location.reload();
  }


  const [isShowLogutModal, setIsShowLogutModal] = useState(false)
  const [logoutLoader, setlogoutLoader] = useState(false)

  return (
    <Container fluid className="py-4">
    
      <Row className="mb-4 align-items-center bg-white shadow-sm rounded p-3">
        <Col md={8}>
          <h2 className="mb-1">📦 Product Catalog</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
        </Col>

        <Col md={4} className="text-end d-flex gap-2 justify-content-end">
          {isClient && (
            <Button variant="primary" onClick={handleManageProducts}>
              <i className="bi bi-gear-fill me-2"></i>
              Manage Products
            </Button>
          )}
          <Button variant="outline-danger" onClick={()=>setIsShowLogutModal(true)}>
            <CiLogout size={20} className="me-1" />
            Logout
          </Button>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={12}>
          <Form.Group>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <Form.Control
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
                style={{ fontSize: '1rem' }}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  <MdCancel />

                </Button>
              )}
            </div>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Loading State */}
      {loading && (
        <Row className="text-center py-5">
          <Col>
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted fs-5">Loading products...</p>
          </Col>
        </Row>
      )}

      {/* Products Grid */}
      {!loading && (
        <>
          {filteredProducts.length === 0 ? (
            <Row className="text-center py-5">
              <Col>
                <div className="mb-4">
                  <i className="bi bi-inbox" style={{ fontSize: '5rem', color: '#ccc' }}></i>
                </div>
                <h3 className="mb-3">No Products Found</h3>
              </Col>
            </Row>
          ) : (
            <>
              {/* Product Count */}
              <Row className="mb-3">
                <Col>
                  <p className="text-muted mb-0">
                    Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </Col>
              </Row>

              
              <Row>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product?._id}
                    product={product}
                    isClient={isClient}
                    viewOnly={true}
                  />
                ))}
              </Row>
            </>
          )}
        </>
      )}
      <LogoutConfirmationModal
        show={isShowLogutModal}
        onClose={() => setIsShowLogutModal(false)}
        onConfirm={handleLogout}

      />
    </Container>
  );
};

export default Dashboard;