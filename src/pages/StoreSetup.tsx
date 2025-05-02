
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Building, Heart, Home, Monitor, ShoppingCart, 
  Cake, Palette, Book, Dumbbell, Gamepad, 
  Leaf, Dog, Diamond, Footprints, Gift, 
  Calendar, Briefcase, FileText 
} from "lucide-react";

const INDUSTRY_ICONS = {
  "Apparel & Accessories": Building,
  "Health & Beauty": Heart,
  "Home & Living": Home,
  "Electronics & Gadgets": Monitor,
  "Groceries & Essentials": ShoppingCart,
  "Bakery & Confectionery": Cake,
  "Art & Crafts": Palette,
  "Books & Media": Book,
  "Sports & Fitness": Dumbbell,
  "Toys & Games": Gamepad,
  "Garden & Outdoor": Leaf,
  "Pets & Pet Supplies": Dog,
  "Jewelry & Watches": Diamond,
  "Footwear": Footprints,
  "Gifts & Souvenirs": Gift,
  "Event Supplies": Calendar,
  "Office Supplies": Briefcase,
  "Digital Products": FileText,
};

const INDUSTRIES = Object.keys(INDUSTRY_ICONS);

const StoreSetup = () => {
  const [storeName, setStoreName] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(industry)) {
        return prev.filter((i) => i !== industry);
      }
      if (prev.length < 3) {
        return [...prev, industry];
      }
      toast({
        title: "Maximum limit reached",
        description: "You can select up to 3 industries only.",
        variant: "destructive",
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
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to set up your store.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("stores")
        .insert([
          {
            user_id: session.user.id,
            store_name: storeName,
            industries: selectedIndustries,
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Store created!",
        description: "Your store has been set up successfully.",
      });

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">Set Up Your Store</CardTitle>
            <CardDescription className="text-lg text-gray-600">Tell us about your business</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Store Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-base font-medium">
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="My Awesome Store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Industry Selection */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Industry</Label>
                    <Badge variant="outline" className="bg-white text-sm py-1">
                      {selectedIndustries.length}/3 selected
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Select up to 3 industries that best describe your business
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INDUSTRIES.map((industry) => {
                      const IconComponent = INDUSTRY_ICONS[industry];
                      const isSelected = selectedIndustries.includes(industry);

                      return (
                        <Toggle
                          key={industry}
                          pressed={isSelected}
                          onPressedChange={() => handleIndustryToggle(industry)}
                          variant="outline"
                          className={`flex flex-col items-center justify-center h-24 text-center gap-2 p-2 border border-gray-200 hover:bg-secondary/50 transition-all ${
                            isSelected 
                              ? "bg-secondary border-primary shadow-sm" 
                              : "bg-white"
                          }`}
                        >
                          <IconComponent 
                            className={`w-6 h-6 ${isSelected ? "text-primary" : "text-gray-500"}`} 
                          />
                          <span className="text-xs font-medium line-clamp-2">
                            {industry}
                          </span>
                        </Toggle>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !storeName || selectedIndustries.length === 0}
                  className="w-full h-12 text-base"
                >
                  {isLoading ? "Creating store..." : "Create Store"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreSetup;
