import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPhoneNumber } from "@/utils/phoneUtils"; // Utility to format phone numbers

const Login = () => {
  // State variables for form fields and UI state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const navigate = useNavigate();

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format phone number if using phone login
      const formattedPhone = loginMethod === "phone" ? formatPhoneNumber(identifier) : identifier;

      // Prepare credentials based on login method
      const credentials =
        loginMethod === "email"
          ? { email: identifier, password }
          : { phone: formattedPhone, password };

      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        // Handle unverified email case
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your inbox and verify your email before logging in.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        // Show general login error
        throw error;
      }

      // Get user ID from session data
      const userId = data.session.user.id;

      // 1. Check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError || !userData) {
        toast({
          title: "Account Not Found",
          description: "No account found. Please sign up.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 2. Check if the user has a store
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (storeError || !storeData) {
        navigate("/store-setup");
        toast({
          title: "No Store Found",
          description: "Please set up your store to continue.",
        });
        setIsLoading(false);
        return;
      }

      // 3. Check if the user has at least one product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id")
        .eq("user_id", userId);

      if (productError || !productData || productData.length === 0) {
        navigate("/add-product");
        toast({
          title: "No Products Found",
          description: "Please add at least one product to continue.",
        });
        setIsLoading(false);
        return;
      }

      // 4. If user, store, and product exist, redirect to dashboard
      navigate("/dashboard");
      toast({
        title: "Logged In!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      // Show error toast for login failure
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Shopy</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Toggle between email and phone login */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "outline"}
                onClick={() => setLoginMethod("email")}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={loginMethod === "phone" ? "default" : "outline"}
                onClick={() => setLoginMethod("phone")}
              >
                Phone
              </Button>
            </div>

            {/* Email or Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="identifier">{loginMethod === "email" ? "Email" : "Phone Number"}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {loginMethod === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <Input
                  id="identifier"
                  type={loginMethod === "email" ? "email" : "tel"}
                  placeholder={loginMethod === "email" ? "your@email.com" : "0712345678"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required
                  title={loginMethod === "phone" ? "Phone number must be valid (e.g., 0712345678 or +256712345678)" : undefined}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                {/* Toggle password visibility */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Link to Signup */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;