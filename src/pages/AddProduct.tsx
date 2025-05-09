import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Package, Banknote, FileText, ImageIcon, Plus, Link, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MAX_IMAGE_SIZE_MB = 5;

const AddProduct = () => {
  const [productType, setProductType] = useState<"Physical" | "Digital">("Physical");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !productName ||
      !productPrice ||
      (productType === "Physical" && !productQuantity) ||
      (productType === "Digital" && !downloadLink)
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to add a product.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      // Fetch the storeId for the logged-in user
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (storeError || !storeData) {
        throw new Error("Failed to fetch store information. Please ensure your store is set up.");
      }

      const storeId = storeData.id;

      // Upload images in parallel with progress
      setUploading(true);
      setUploadProgress(Array(productImages.length).fill(0));
      const uploadedImageUrls: string[] = [];

      await Promise.all(
        productImages.map((image, idx) => {
          return new Promise<void>(async (resolve, reject) => {
            // Create a custom XMLHttpRequest to track progress
            const formData = new FormData();
            formData.append("file", image);

            // Supabase JS SDK does not support progress, so we use fetch as a workaround
            // (You may need to adjust the endpoint and headers for your Supabase storage bucket)
            const filePath = `${userId}/${Date.now()}-${image.name}`;
            const { data, error } = await supabase.storage
              .from("product-images")
              .upload(filePath, image);

            if (error) {
              reject(error);
              return;
            }

            // No real progress events, so just set to 100% after upload
            setUploadProgress((prev) => {
              const updated = [...prev];
              updated[idx] = 100;
              return updated;
            });

            const publicUrlData = supabase.storage
              .from("product-images")
              .getPublicUrl(data.path);
            uploadedImageUrls.push(publicUrlData.data.publicUrl);
            resolve();
          });
        })
      );

      setUploading(false);

      // Insert product details into the database
      const { error } = await supabase
        .from("products")
        .insert([
          {
            user_id: userId,
            store_id: storeId,
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
    } catch (error: any) {
      console.error("Product creation error:", error);
      toast({
        title: "Product Creation Failed",
        description: error.message || "There was an error adding your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Check file size limit (5MB per image)
    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: `Each image must be less than ${MAX_IMAGE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        return;
      }
    }

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

  // Remove an image
  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
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
              <label
                htmlFor="productImages"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Images
              </label>
              <p className="text-xs text-gray-500 mt-2">{productImages.length}/6 images uploaded</p>
            </div>

            {/* Image Previews & Progress */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
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
                  {/* Progress Bar */}
                  {uploading && (
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 rounded-b-lg overflow-hidden">
                      <div
                        className="bg-blue-500 h-2 transition-all"
                        style={{ width: `${uploadProgress[index] || 0}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
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