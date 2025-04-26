import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let { data, error } = await supabase.auth.resetPasswordForEmail(identifier, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Reset link sent!",
        description: resetMethod === "email" 
          ? "Check your email for the password reset link."
          : "Check your phone for the reset code.",
      });

      // Clear the form
      setIdentifier("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Reset Failed",
        description: error.message || "Unable to send reset instructions. Please try again.",
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
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your {resetMethod === "email" ? "email" : "phone number"} to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={resetMethod === "email" ? "default" : "outline"}
                onClick={() => setResetMethod("email")}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={resetMethod === "phone" ? "default" : "outline"}
                onClick={() => setResetMethod("phone")}
              >
                Phone
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">
                {resetMethod === "email" ? "Email" : "Phone Number"}
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {resetMethod === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <Input
                  id="identifier"
                  type={resetMethod === "email" ? "email" : "tel"}
                  placeholder={resetMethod === "email" ? "your@email.com" : "+1234567890"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required
                  pattern={resetMethod === "phone" ? "^\\+[0-9]{10,15}$" : undefined}
                  title={resetMethod === "phone" ? "Phone number must start with + and contain 10-15 digits" : undefined}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-shopy-500 hover:bg-shopy-600"
            disabled={isLoading}
          >
            {isLoading ? "Sending instructions..." : "Send Reset Instructions"}
          </Button>

          <div className="text-center text-sm">
            <Link to="/login" className="text-shopy-600 hover:text-shopy-700 hover:underline font-medium">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 