import React from 'react';
import { useSelector } from 'react-redux';

const ProductCard = ({ product, onEdit, onDelete, viewOnly }) => {
  const { user } = useSelector((state) => state.auth);
  const isClient = user?.role === 'client';

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border border-2 rounded-3">

        <div className="card-body d-flex flex-column">
          
          {/*prdocut  */}
          <div className="mb-2">
            <small className="text-uppercase text-secondary fw-semibold">
              Product Name
            </small>
            <h5 className="fw-bold text-dark text-truncate mb-0">
              {product?.name}
            </h5>
          </div>

          {/* category */}
          <div className="mb-3">
            <small className="text-uppercase text-secondary fw-semibold">
              Category
            </small>
            <div>
              <span className="badge bg-info-subtle text-info fw-medium px-2 py-1">
                {product?.category}
              </span>
            </div>
          </div>

          {/* desc */}
          <div className="mb-3">
            <small className="text-uppercase text-secondary fw-semibold">
              Description
            </small>
            <p className="text-muted small mb-0">
              {product?.description}
            </p>
          </div>

          {/* prcie & sales */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
            <div>
              <small className="text-uppercase text-secondary fw-semibold">
                Price
              </small>
              <div className="fs-5 fw-bold text-success">
                ₹{product?.price}
              </div>
            </div>

            {product?.totalSales !== undefined && (
              <div className="text-end">
                
                <div className="badge bg-success">
                  {product?.totalSales} sold
                </div>
              </div>
            )}
          </div>
        </div>

        
        {isClient && !viewOnly && (
          <div className="card-footer bg-light border-top">
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary w-50"
                onClick={() => onEdit(product)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger w-50"
                onClick={() => onDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductCard;
