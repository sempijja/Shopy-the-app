
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import { supabase, fetchUserMetadata } from "@/lib/supabase";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials =
        loginMethod === "email"
          ? { email: identifier, password }
          : { phone: identifier, password };

      console.log("Attempting login with:", credentials);

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        console.error("Login error details:", error);

        // Specific handling for unverified email
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your inbox and verify your email before logging in.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        throw error;
      }

      console.log("Login successful:", data);

      // Fetch user metadata
      const userId = data.session.user.id;
      const metadata = await fetchUserMetadata(userId);

      if (!metadata?.onboarding_completed) {
        // Redirect to onboarding process
        navigate("/store-setup");
      } else {
        // Redirect to dashboard
        navigate("/dashboard");
      }

      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
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
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Shopy</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                  placeholder={loginMethod === "email" ? "your@email.com" : "+1234567890"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required
                  pattern={loginMethod === "phone" ? "^\\+[0-9]{10,15}$" : undefined}
                  title={loginMethod === "phone" ? "Phone number must start with + and contain 10-15 digits" : undefined}
                />
              </div>
            </div>

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

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

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
