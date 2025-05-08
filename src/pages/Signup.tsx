import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPhoneNumber } from "@/utils/phoneUtils"; // Import the phone update utility function

const Signup = () => {
  // State variables to manage form inputs and UI behavior
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number if signup method is phone
      const formattedPhone = signupMethod === "phone" ? formatPhoneNumber(identifier) : identifier;

      const credentials =
        signupMethod === "email"
          ? { email: identifier, password }
          : { phone: formattedPhone, password };

      const { data, error } = await supabase.auth.signUp({
        ...credentials,
        options: {
          data: {
            full_name: name, // Store the user's full name in the database
            onboarding_completed: false, // Set onboarding status to false
          },
          emailRedirectTo: `${window.location.origin}/store-setup`, // Redirect to store setup after confirmation
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      if (signupMethod === "email") {
        toast({
          title: "Account created!",
          description: "Please check your email for verification. You must verify your email before continuing.",
        });
        // After email verification, user will log in and be routed as in Login.tsx
        navigate("/login");
      } else {
        // Phone verification
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        if (otpError) {
          console.error("OTP sending error:", otpError);
          throw otpError;
        }

        toast({
          title: "Account created!",
          description: "An OTP has been sent to your phone. Please verify your account.",
        });

        navigate("/otp-verification"); // Navigate to the OTP verification screen
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Container for the signup form */}
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join Shopy</h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Toggle buttons for selecting signup method */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={signupMethod === "email" ? "default" : "outline"}
                onClick={() => setSignupMethod("email")}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={signupMethod === "phone" ? "default" : "outline"}
                onClick={() => setSignupMethod("phone")}
              >
                Phone
              </Button>
            </div>

            {/* Full name input */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Names</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email or phone input based on signup method */}
            <div className="space-y-2">
              <Label htmlFor="identifier">
                {signupMethod === "email" ? "Email" : "Phone Number"}
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {signupMethod === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <Input
                  id="identifier"
                  type={signupMethod === "email" ? "email" : "tel"}
                  placeholder={signupMethod === "email" ? "your@email.com" : "0712345678"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required
                  title={signupMethod === "phone" ? "Phone number must be valid (e.g., 0712345678 or +256712345678)" : undefined}
                />
              </div>
            </div>

            {/* Password input */}
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
                  minLength={8}
                />
                {/* Toggle button to show/hide password */}
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

            {/* Confirm password input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          {/* Link to login page */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
