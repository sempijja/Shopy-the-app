import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Building } from "lucide-react";

// List of available industries
const INDUSTRIES = [
  "Fashion & Apparel",
  "Electronics",
  "Home & Furniture",
  "Beauty & Personal Care",
  "Food & Beverages",
  "Health & Wellness",
  "Digital Products",
  "Arts & Crafts",
  "Sports & Outdoors",
  "Toys & Games",
  "Jewelry & Accessories",
  "Books & Media",
  "Automotive",
  "Pet Supplies",
  "Office Supplies"
];

const StoreSetup = () => {
  const [storeName, setStoreName] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustries((prev) => {
      // If already selected, remove it
      if (prev.includes(industry)) {
        return prev.filter(i => i !== industry);
      }
      
      // If not selected and less than 3 industries are selected, add it
      if (prev.length < 3) {
        return [...prev, industry];
      }
      
      // If trying to select more than 3, show a toast and return unchanged
      toast({
        title: "Maximum limit reached",
        description: "You can select up to 3 industries only.",
        variant: "destructive"
      });
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIndustries.length === 0) {
      toast({
        title: "Industry required",
        description: "Please select at least one industry for your store.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store creation logic would go here in a real application
      console.log("Creating store with:", { storeName, selectedIndustries });
      
      // Simulate successful store creation
      toast({
        title: "Store created!",
        description: "Your store has been set up successfully.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Store setup error:", error);
      toast({
        title: "Store Setup Failed",
        description: "There was an error setting up your store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Store</h1>
          <p className="mt-2 text-gray-600">Tell us about your business</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="storeName"
                  type="text"
                  placeholder="My Awesome Store"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>
                Industry (Select up to 3)
                <span className="ml-1 text-sm text-gray-500">
                  {selectedIndustries.length}/3 selected
                </span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                {INDUSTRIES.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={selectedIndustries.includes(industry)}
                      onCheckedChange={() => handleIndustryChange(industry)}
                    />
                    <label
                      htmlFor={`industry-${industry}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {industry}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !storeName || selectedIndustries.length === 0}
          >
            {isLoading ? "Creating store..." : "Create Store"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StoreSetup;
