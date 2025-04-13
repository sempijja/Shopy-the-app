
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Building,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Coffee,
  Pill,
  FileDigit,
  Palette,
  Dumbbell,
  GamepadIcon,
  Gem,
  BookOpen,
  Car,
  Cat,
  Briefcase
} from "lucide-react";

// Map of industries with their corresponding icons
const INDUSTRY_ICONS = {
  "Fashion & Apparel": Shirt,
  "Electronics": Smartphone,
  "Home & Furniture": Home,
  "Beauty & Personal Care": Sparkles,
  "Food & Beverages": Coffee,
  "Health & Wellness": Pill,
  "Digital Products": FileDigit,
  "Arts & Crafts": Palette,
  "Sports & Outdoors": Dumbbell,
  "Toys & Games": GamepadIcon,
  "Jewelry & Accessories": Gem,
  "Books & Media": BookOpen,
  "Automotive": Car,
  "Pet Supplies": Cat,
  "Office Supplies": Briefcase
};

// List of available industries
const INDUSTRIES = Object.keys(INDUSTRY_ICONS);

const StoreSetup = () => {
  const [storeName, setStoreName] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleIndustryToggle = (industry: string) => {
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
      
      // Redirect to product creation page
      navigate("/add-product");
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Store</h1>
          <p className="mt-2 text-gray-600">Tell us about your business</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center">
                <Label>Industry</Label>
                <Badge variant="outline" className="font-normal">
                  {selectedIndustries.length}/3 selected
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INDUSTRIES.map((industry) => {
                  const IconComponent = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS];
                  const isSelected = selectedIndustries.includes(industry);
                  
                  return (
                    <Toggle
                      key={industry}
                      pressed={isSelected}
                      onPressedChange={() => handleIndustryToggle(industry)}
                      className={`flex-col h-24 items-center justify-center gap-2 p-3 text-center ${
                        isSelected ? 'border-primary' : 'border-input'
                      }`}
                    >
                      <IconComponent className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                      <span className="text-xs">{industry}</span>
                    </Toggle>
                  );
                })}
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
