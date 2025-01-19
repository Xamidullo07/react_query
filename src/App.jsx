import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ToastContainer, toast } from 'react-toastify'
import ReactModal from 'react-modal'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import './App.css'

const queryClient = new QueryClient()
ReactModal.setAppElement('#root')

function ProductsComponent() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://dummyjson.com/products')
      return response.data
    },
    onError: () => {
      toast.error('Failed to load products. Please try again later.')
    }
  })

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    toast.info(`Selected: ${product.title} - $${product.price}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>Error loading products</div>
  }

  return (
    <div className="container">
      <div className="products-section">
        <h2>Products</h2>
        <div className="products-list">
          {data?.products?.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleProductClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={product.thumbnail} 
                alt={product.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <h3>{product.title}</h3>
              <p className="price">Price: ${product.price}</p>
              <p className="description">{product.description}</p>
              <p className="category">Category: {product.category}</p>
              <p>Rating: {product.rating}⭐</p>
              <p>Stock: {product.stock} units</p>
            </div>
          ))}
        </div>
      </div>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedProduct && (
          <div className="modal-inner">
            <button 
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2>{selectedProduct.title}</h2>
            <div className="modal-images">
              {selectedProduct.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`${selectedProduct.title} - Image ${index + 1}`}
                  className="modal-image"
                />
              ))}
            </div>
            <div className="modal-details">
              <p className="price">Price: ${selectedProduct.price}</p>
              <p className="discount">Discount: {selectedProduct.discountPercentage}%</p>
              <p className="description">{selectedProduct.description}</p>
              <p className="brand">Brand: {selectedProduct.brand}</p>
              <p className="category">Category: {selectedProduct.category}</p>
              <p>Rating: {selectedProduct.rating}⭐</p>
              <p>Stock: {selectedProduct.stock} units</p>
            </div>
          </div>
        )}
      </ReactModal>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Products Catalog</h1>
        <ProductsComponent />
        <ToastContainer />
      </div>
    </QueryClientProvider>
  )
}

export default App