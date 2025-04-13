
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Package, DollarSign, FileText, ImageIcon, Plus } from "lucide-react";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !productPrice) {
      toast({
        title: "Missing information",
        description: "Please provide a product name and price.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Product creation logic would go here in a real application
      console.log("Creating product:", { 
        name: productName, 
        price: productPrice,
        description: productDescription 
      });
      
      // Simulate successful product creation
      toast({
        title: "Product added!",
        description: "Your product has been added successfully.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Product creation error:", error);
      toast({
        title: "Product Creation Failed",
        description: "There was an error adding your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Add Your First Product</h1>
          <p className="mt-2 text-gray-600">Let's get your store inventory started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="productName"
                  type="text"
                  placeholder="Awesome Product"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice">Price</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <div className="relative">
                <Textarea
                  id="productDescription"
                  placeholder="Describe your product..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-gray-100 rounded-full mb-3">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Drag and drop product images</p>
                <p className="text-xs text-gray-500 mb-4">or</p>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !productName || !productPrice}
          >
            {isLoading ? "Adding product..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
