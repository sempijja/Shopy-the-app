
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Package, Banknote, FileText, ImageIcon, Plus, Link, X, ChevronLeft } from "lucide-react";

const ProductDetails = () => {
  // Mock data for product details
  const [productType, setProductType] = useState<"Physical" | "Digital">("Physical");
  const [productName, setProductName] = useState("Premium Sneakers");
  const [productPrice, setProductPrice] = useState("89.99");
  const [productQuantity, setProductQuantity] = useState("45");
  const [downloadLink, setDownloadLink] = useState("");
  const [productDescription, setProductDescription] = useState("High-quality sneakers perfect for running and casual wear. Available in multiple sizes.");
  const [productImages, setProductImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2960&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2960&auto=format&fit=crop"
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission - just a mock for now
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Product updated!",
        description: "Your product has been updated successfully.",
      });
      setIsLoading(false);
      navigate("/products");
    }, 1000);
  };

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (files.length + productImages.length > 6) {
      toast({
        title: "Image limit exceeded",
        description: "You can upload up to 6 images only.",
        variant: "destructive",
      });
      return;
    }

    // Create URLs for the new images
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...newImageUrls]);
  };

  // Remove an image
  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b">
        <button onClick={() => navigate("/products")} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold flex-grow text-center">Product details</h1>
        <div className="w-6"></div> {/* Placeholder for alignment */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Image Upload - Now at the top */}
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-gray-100 rounded-full mb-3">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">Drag and drop product images</p>
            <p className="text-xs text-gray-500 mb-4">or</p>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="productImages"
            />
            <label htmlFor="productImages" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
              <Plus className="h-4 w-4 mr-2" />
              Upload Images
            </label>
            <p className="text-xs text-gray-500 mt-2">{productImages.length}/6 images uploaded</p>
          </div>

          {/* Image Previews */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {productImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Product Type Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="productType">What type of product is this?</Label>
          <select
            id="productType"
            value={productType}
            onChange={(e) => setProductType(e.target.value as "Physical" | "Digital")}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="Physical">Physical Product (e.g., Shoes)</option>
            <option value="Digital">Digital Product (e.g., Videos, NFTs)</option>
          </select>
        </div>

        {/* Product Name */}
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

        {/* Product Price */}
        <div className="space-y-2">
          <Label htmlFor="productPrice">Price</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Banknote className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="productPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Quantity or Download Link */}
        {productType === "Physical" ? (
          <div className="space-y-2">
            <Label htmlFor="productQuantity">Quantity</Label>
            <Input
              id="productQuantity"
              type="number"
              min="1"
              placeholder="10"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="downloadLink">Download Link</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="downloadLink"
                type="url"
                placeholder="https://example.com/download"
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        )}

        {/* Product Description */}
        <div className="space-y-2">
          <Label htmlFor="productDescription">Description</Label>
          <Textarea
            id="productDescription"
            placeholder="Say something about this product..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default ProductDetails;
