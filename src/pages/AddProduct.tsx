import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Package, DollarSign, FileText, ImageIcon, Plus, Link } from "lucide-react";

const AddProduct = () => {
  // State variables for form inputs
  const [productType, setProductType] = useState<"Physical" | "Digital">("Physical"); // Dropdown for product type
  const [productName, setProductName] = useState(""); // Product name
  const [productPrice, setProductPrice] = useState(""); // Product price
  const [productQuantity, setProductQuantity] = useState(""); // Quantity (for physical products)
  const [downloadLink, setDownloadLink] = useState(""); // Download link (for digital products)
  const [productDescription, setProductDescription] = useState(""); // Product description
  const [productImages, setProductImages] = useState<File[]>([]); // Product images (up to 6)
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !productPrice || (productType === "Physical" && !productQuantity) || (productType === "Digital" && !downloadLink)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = supabase.auth.user();
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to add a product.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Fetch the storeId for the logged-in user
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (storeError || !storeData) {
        throw new Error("Failed to fetch store information. Please ensure your store is set up.");
      }

      const storeId = storeData.id;

      // Upload images to Supabase storage
      const uploadedImageUrls: string[] = [];
      for (const image of productImages) {
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(`${user.id}/${Date.now()}-${image.name}`, image);

        if (error) {
          throw error;
        }

        const publicUrl = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path).publicUrl;

        uploadedImageUrls.push(publicUrl);
      }

      // Insert product details into the database
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            user_id: user.id,
            store_id: storeId, // Use the fetched storeId
            name: productName,
            price: parseFloat(productPrice),
            quantity: productType === "Physical" ? parseInt(productQuantity) : null,
            download_link: productType === "Digital" ? downloadLink : null,
            description: productDescription,
            images: uploadedImageUrls,
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Product added!",
        description: "Your product has been added successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Product creation error:", error);
      toast({
        title: "Product Creation Failed",
        description: error.message || "There was an error adding your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

    setProductImages((prev) => [...prev, ...files]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Add Your First Product</h1>
          <p className="mt-2 text-gray-600">Let's get your store inventory started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Describe your product..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Image Upload */}
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
              <Button as="label" htmlFor="productImages" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <p className="text-xs text-gray-500 mt-2">{productImages.length}/6 images uploaded</p>
            </div>
          </div>

          {/* Submit Button */}
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
