
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Search,
  Plus, 
  Home, 
  ListOrdered, 
  Bell, 
  User 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Products = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  // Mock data for products
  const products = [
    { id: 1, name: "Product name", price: "UGX (price)", quantity: 5 },
    { id: 2, name: "Product name", price: "UGX (price)", quantity: 10 },
    { id: 3, name: "Product name", price: "UGX (price)", quantity: 3 },
    { id: 4, name: "Product name", price: "UGX (price)", quantity: 8 },
    { id: 5, name: "Product name", price: "UGX (price)", quantity: 12 },
    { id: 6, name: "Product name", price: "UGX (price)", quantity: 6 },
    { id: 7, name: "Product name", price: "UGX (price)", quantity: 15 },
    { id: 8, name: "Product name", price: "UGX (price)", quantity: 4 },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "products") {
      navigate(`/${tab}`);
    }
  };
  
  const goToProductDetails = (id) => {
    navigate("/product-details");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Fixed Header */}
      <div className="flex items-center px-4 py-3 bg-white z-10">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center">Products</h1>
        <div className="w-6"></div> {/* Placeholder for alignment */}
      </div>

      {/* Fixed Search Bar */}
      <div className="px-4 py-2 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text"
            placeholder="Search"
            className="pl-10 bg-gray-100 border-none rounded-lg"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="px-4 pb-24">
          {products.map((product) => (
            <div 
              key={product.id}
              className="py-4 border-b border-gray-100 flex justify-between items-center"
              onClick={() => goToProductDetails(product.id)}
            >
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.price}</p>
              </div>
              <div className="text-right text-gray-500">
                {`{quantity}`}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Fixed Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <button 
          className="bg-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={() => navigate('/add-product')}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-20">
        <button 
          onClick={() => handleTabChange('dashboard')} 
          className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => handleTabChange('orders')} 
          className={`flex flex-col items-center p-2 ${activeTab === 'orders' ? 'text-primary' : 'text-gray-500'}`}
        >
          <ListOrdered className="h-5 w-5" />
          <span className="text-xs mt-1">Orders</span>
        </button>
        <button 
          onClick={() => handleTabChange('products')} 
          className={`flex flex-col items-center p-2 ${activeTab === 'products' ? 'text-primary' : 'text-gray-500'}`}
        >
          <div className="relative">
            <div className="h-5 w-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <span className="text-xs mt-1 text-primary font-medium">Products</span>
        </button>
        <button 
          onClick={() => handleTabChange('alerts')} 
          className={`flex flex-col items-center p-2 ${activeTab === 'alerts' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Bell className="h-5 w-5" />
          <span className="text-xs mt-1">Alerts</span>
        </button>
        <button 
          onClick={() => handleTabChange('profile')} 
          className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-primary' : 'text-gray-500'}`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Products;
