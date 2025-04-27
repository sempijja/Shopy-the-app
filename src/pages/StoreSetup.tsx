import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/lib/supabase";
import { Building } from "lucide-react";

const INDUSTRY_ICONS = {
  "Fashion & Apparel": Building,
  // Add other industries here...
};

const INDUSTRIES = Object.keys(INDUSTRY_ICONS);

const StoreSetup = () => {
  const [storeName, setStoreName] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = supabase.auth.user();
    if (!user) {
      navigate("/login");
    }
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
      const user = supabase.auth.user();
      if (!user) {
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
            user_id: user.id,
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
              <Input
                id="storeName"
                type="text"
                placeholder="My Awesome Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Industry</Label>
                <Badge variant="outline">{selectedIndustries.length}/3 selected</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((industry) => {
                  const IconComponent = INDUSTRY_ICONS[industry];
                  const isSelected = selectedIndustries.includes(industry);

                  return (
                    <Toggle
                      key={industry}
                      pressed={isSelected}
                      onPressedChange={() => handleIndustryToggle(industry)}
                    >
                      <IconComponent />
                      <span>{industry}</span>
                    </Toggle>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            type="submit"
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
