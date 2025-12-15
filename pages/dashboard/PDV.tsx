import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

export const PDV: React.FC = () => {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Product List */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="cursor-pointer group border border-gray-200 rounded-lg p-4 hover:border-accent hover:shadow-md transition-all"
              >
                <div className="h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">IMG</span>
                </div>
                <h4 className="font-bold text-gray-900 line-clamp-2 h-10 text-sm font-heading">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-accent">R$ {product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Est: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-xl">
          <h2 className="font-bold text-lg flex items-center font-heading">
            <ShoppingCart className="mr-2" size={20} /> 
            Carrinho
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {cart.reduce((acc, i) => acc + i.quantity, 0)} itens
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Carrinho vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 font-heading">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-sm mr-4">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl space-y-4">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900 font-heading">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">Cancelar</Button>
            <Button className="w-full" disabled={cart.length === 0}>Finalizar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};