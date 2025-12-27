import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";

import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAIInsights,
} from '../../redux/slices/productSlice';

import ProductCard from '../../component/ProductCard';
import AddProductModal from '../../component/client/AddProductModal';
import { Container, Row, Col, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { MdCancel } from "react-icons/md";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { myProducts, loading, error, aiInsights, insightsLoading } = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);


    const isClient = user.role == 'client'
    console.log("filteredProductsfilteredProducts", isClient);
    useEffect(() => {
        if (myProducts && myProducts?.length > 0) {
            setFilteredProducts(myProducts)
        }
    }, [myProducts])

    
    const id = user?._id;
    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchAIInsights());
    }, [dispatch]);

    const handleShowModal = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    console.log("editingProducteditingProducteditingProduct", editingProduct);

    
    const handleSubmitProduct = async (formData) => {
        setActionLoading(true);
        console.log("submti called 1");

        try {
            if (editingProduct) {
                console.log("submti called 2");
                await dispatch(updateProduct({ id: editingProduct._id, productData: formData })).unwrap();
                console.log("submti called 3");
                toast.success('Product updated successfully!');
            } else {
                await dispatch(createProduct(formData)).unwrap();
                toast.success('Product created successfully!');
            }
            console.log("submti called 4");
            handleCloseModal();
            console.log("submti called 5");
            dispatch(fetchProductById(id));
        } catch (err) {
            console.error('Error submitting product:', err);
            toast.error(err || 'Failed to save product');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(productId)).unwrap();
                toast.success('Product deleted successfully!');
                dispatch(fetchProductById(id));
            } catch (err) {
                console.error('Error deleting product:', err);
                toast.error(err || 'Failed to delete product');
            }
        }
    };

    useEffect(() => {
        // if (searchTerm != "") {
        if (!searchTerm || searchTerm == '') {
            return setFilteredProducts(myProducts)
        }
        const timer = setTimeout(() => {
            const filteredProd = myProducts.filter((data) => data.name.toLowerCase().includes(searchTerm.toLowerCase()) || data.category.toLowerCase().includes(searchTerm.toLowerCase()))
            console.log("log of searc debounce::", filteredProd);
            setFilteredProducts(filteredProd)

        }, 500);
        return () => clearTimeout(timer)
        // }
        // else {

        // }
    }, [searchTerm, myProducts])

    const navigate = useNavigate()
    if (!isClient) {
        return navigate('/dasboard')
    }
    return (
        <Container fluid className="py-4">
            
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-box-seam text-primary me-3" style={{ fontSize: '2.5rem' }}></i>
                        <div>
                            <h2 className="mb-0">Product Management</h2>
                            <p className="text-muted mb-0">
                                Manage your product inventory • <Badge bg="secondary">{myProducts?.length} Products</Badge>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>

          
            <Row className="mb-4">
                <Col>
                    <div className="bg-white border rounded shadow-sm p-4">
          
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h4 className="mb-0">
                                <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                                AI Insights & Recommendations
                            </h4>
                            {aiInsights && (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => dispatch(fetchAIInsights())}
                                >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    Refresh
                                </Button>
                            )}
                        </div>

                   
                        {insightsLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" style={{ width: '2.5rem', height: '2.5rem' }} />
                                <p className="mt-3 text-muted mb-0">Analyzing your products...</p>
                            </div>
                        ) : aiInsights ? (
                            <>
                                
                                <Row className="mb-4">
                                
                                    <Col md={3} className="mb-3">
                                        <div className="bg-primary bg-opacity-10 rounded p-3 text-center">
                                            <i className="bi bi-box-seam text-primary" style={{ fontSize: '2rem' }}></i>
                                            <h3 className="mt-2 mb-0">{aiInsights.totalProducts || 0}</h3>
                                            <small className="text-muted">Total Products</small>
                                        </div>
                                    </Col>

                                    {/* Average Price */}
                                    <Col md={3} className="mb-3">
                                        <div className="bg-success bg-opacity-10 rounded p-3 text-center">
                                            <i className="bi bi-currency-rupee text-success" style={{ fontSize: '2rem' }}></i>
                                            <h3 className="mt-2 mb-0">₹{aiInsights.averagePrice || 0}</h3>
                                            <small className="text-muted">Average Price</small>
                                        </div>
                                    </Col>

                                    {/* Total Sales */}
                                    <Col md={3} className="mb-3">
                                        <div className="bg-info bg-opacity-10 rounded p-3 text-center">
                                            <i className="bi bi-graph-up text-info" style={{ fontSize: '2rem' }}></i>
                                            <h3 className="mt-2 mb-0">{aiInsights.totalSales || 0}</h3>
                                            <small className="text-muted">Total Sales</small>
                                        </div>
                                    </Col>

                                    {/* Categories */}
                                    <Col md={3} className="mb-3">
                                        <div className="bg-warning bg-opacity-10 rounded p-3 text-center">
                                            <i className="bi bi-tags text-warning" style={{ fontSize: '2rem' }}></i>
                                            <h3 className="mt-2 mb-0">{aiInsights.categories?.length || 0}</h3>
                                            <small className="text-muted">Categories</small>
                                        </div>
                                    </Col>
                                </Row>

                                
                                {aiInsights.topProducts && aiInsights.topProducts.length > 0 && (
                                    <div className="mb-4">
                                        <h5 className="mb-3">
                                            <i className="bi bi-star-fill text-warning me-2"></i>
                                            Top Performing Products
                                        </h5>
                                        <div className="list-group">
                                            {aiInsights.topProducts.slice(0, 5).map((product, index) => (
                                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <span className="badge bg-primary rounded-circle me-3" style={{ width: '30px', height: '30px', lineHeight: '30px' }}>
                                                            {index + 1}
                                                        </span>
                                                        <div>
                                                            <h6 className="mb-0">{product.name}</h6>
                                                            <small className="text-muted">{product.category}</small>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="badge bg-success">{product.totalSales} sold</span>
                                                        <div className="text-muted small">₹{product.price}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                
                                {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                                    <div className="mb-4">
                                        <h5 className="mb-3">
                                            <i className="bi bi-clipboard-check text-info me-2"></i>
                                            AI Recommendations
                                        </h5>
                                        <div className="bg-light rounded p-3">
                                            {aiInsights.recommendations.map((recommendation, index) => (
                                                <Alert key={index} variant="info" className="mb-2 d-flex align-items-start">
                                                    <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                                                    <div>{recommendation}</div>
                                                </Alert>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Category Distribution */}
                                {aiInsights.categoryDistribution && (
                                    <div className="mb-4">
                                        <h5 className="mb-3">
                                            <i className="bi bi-pie-chart text-primary me-2"></i>
                                            Category Distribution
                                        </h5>
                                        <div className="row">
                                            {Object.entries(aiInsights.categoryDistribution).map(([category, count], index) => (
                                                <div key={index} className="col-md-4 mb-2">
                                                    <div className="bg-light rounded p-3 d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold">{category}</span>
                                                        <span className="badge bg-primary">{count} products</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Market Insights */}
                                {aiInsights.marketInsights && (
                                    <div>
                                        <h5 className="mb-3">
                                            <i className="bi bi-graph-up-arrow text-success me-2"></i>
                                            Market Insights
                                        </h5>
                                        <div className="bg-light rounded p-3">
                                            <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                                                {aiInsights.marketInsights}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                
                                <details className="mt-3">
                                    <summary className="text-muted" style={{ cursor: 'pointer' }}>
                                        <small>View Raw Data</small>
                                    </summary>
                                    <pre className="mt-2 bg-light p-3 rounded" style={{
                                        fontSize: '12px',
                                        maxHeight: '300px',
                                        overflow: 'auto'
                                    }}>
                                        {JSON.stringify(aiInsights, null, 2)}
                                    </pre>
                                </details>
                            </>
                        ) : (
                            <Alert variant="light" className="text-center py-5 mb-0">
                                <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                <h5 className="mt-3">No insights available yet</h5>
                                <p className="text-muted mb-3">Add products to get AI-powered insights and recommendations</p>
                                <Button variant="primary" onClick={() => dispatch(fetchAIInsights())}>
                                    Generate Insights
                                </Button>
                            </Alert>
                        )}
                    </div>
                </Col>
            </Row>

            
            <Row className="mb-4">
                <Col lg={9}>
                    <Form.Group>
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search"></i>
                            </span>
                            <Form.Control
                                type="text"
                                placeholder="Search products by name, category"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-start-0"
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

                
                <Col lg={3}>
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-100"
                        onClick={handleShowModal}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Product
                    </Button>
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
                    {filteredProducts && filteredProducts?.length === 0 ? (
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
                                        My Proudcts
                                    </p>
                                </Col>
                            </Row>

                            {/* Products Grid */}
                            <Row>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product?._id}
                                        product={product}
                                        // isClient={true}
                                        onEdit={handleEditProduct}
                                        onDelete={handleDeleteProduct}
                                        viewOnly={false}
                                    // viewOnly={false}
                                    />
                                ))}
                            </Row>
                        </>
                    )}
                </>
            )}

            
            <AddProductModal
                show={showModal}
                handleClose={handleCloseModal}
                onSubmit={handleSubmitProduct}
                editProduct={editingProduct}
                loading={actionLoading}
            />
        </Container>
    );
};

export default ClientDashboard;