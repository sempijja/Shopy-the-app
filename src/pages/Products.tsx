
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Search, 
  ChevronRight, 
  Plus, 
  Home, 
  ListOrdered, 
  Bell, 
  User 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Products = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  // Mock data for recently updated products
  const recentProducts = [
    {
      id: 1,
      name: "Premium Sneakers",
      status: "Live",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2960&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Running Shoes",
      status: "Draft",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2960&auto=format&fit=crop"
    }
  ];

  // Mock data for collections
  const collections = [
    { id: 1, name: "Collection 1" }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "products") {
      navigate(`/${tab}`);
    }
  };
  
  const goToProductDetails = () => {
    navigate("/product-details");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center">Products</h1>
        <div className="w-6"></div> {/* Placeholder for alignment */}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text"
            placeholder="Search"
            className="pl-10 bg-gray-100 border-none"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-16 overflow-y-auto">
        {/* Recently Updated Products */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Recently updated products</h2>
          <div className="grid grid-cols-2 gap-4">
            {recentProducts.map((product) => (
              <div 
                key={product.id} 
                className="rounded-lg overflow-hidden border border-gray-200"
                onClick={goToProductDetails}
              >
                <div className="h-32 bg-gray-200 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="font-medium">{product.name}</p>
                  <p className={cn(
                    "text-sm",
                    product.status === "Live" ? "text-green-600" : "text-red-500"
                  )}>
                    {product.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3" onClick={goToProductDetails}>
            <h2 className="text-lg font-medium">All products</h2>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Collections */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Collections</h2>
            <button className="text-primary font-medium">Expand</button>
          </div>
          {collections.map((collection) => (
            <div key={collection.id} className="flex justify-between items-center py-3 border-b">
              <p>{collection.name}</p>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Inventory */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Inventory</h2>
            <button className="text-primary font-medium">Expand</button>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p>All products</p>
              <p className="text-sm text-gray-500">100 pcs</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p>Out of stock products</p>
              <p className="text-sm text-gray-500">44 pcs</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4">
        <button 
          className="bg-primary rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={() => navigate('/add-product')}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
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
