import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Search,
  Plus, 
  Home, 
  ListOrdered, 
  Bell, 
  User,
  Package 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";

const Products = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          console.error("User not authenticated");
          navigate("/login");
          return;
        }

        const userId = session.session.user.id;

        // Fetch store_id for the user
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (storeError || !storeData) {
          console.error("Store not found:", storeError);
          navigate("/store-setup");
          return;
        }

        const storeId = storeData.id;

        // Fetch products for the user and store
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("id, name, price, quantity")
          .eq("user_id", userId)
          .eq("store_id", storeId);

        if (productsError) {
          console.error("Error fetching products:", productsError);
          return;
        }

        setProducts(productsData || []);
        setFilteredProducts(productsData || []); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        navigate("/dashboard");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "products":
        navigate("/products"); // Navigate to the Products page
        break;
      case "alerts":
        navigate("/alerts");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  const goToProductDetails = (id) => {
    navigate(`/product-details/${id}`);
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
            placeholder="Search products"
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 bg-gray-100 border-none rounded-lg"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="px-4 pb-24">
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
              <Package className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try searching for a different product.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="py-4 border-b border-gray-100 flex justify-between items-center"
                onClick={() => goToProductDetails(product.id)}
              >
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">UGX {product.price.toFixed(2)}</p>
                </div>
                <div className="text-right text-gray-500">
                  {product.quantity} in stock
                </div>
              </div>
            ))
          )}
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