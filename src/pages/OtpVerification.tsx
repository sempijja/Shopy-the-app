import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the OTP sent to your phone.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify the OTP using Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token: otp,
        type: "sms",
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification Successful",
        description: "Your phone number has been verified.",
      });

      // Navigate to the onboarding process
      navigate("/store-setup");
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const phoneNumber = localStorage.getItem("phoneNumber") || "";
      const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });

      if (error) {
        throw error;
      }

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone.",
      });
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      toast({
        title: "Resend Failed",
        description: error.message || "Unable to resend OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Your Phone</h1>
          <p className="mt-2 text-gray-600">
            Enter the OTP sent to your phone number to verify your account.
          </p>
        </div>

        <form onSubmit={handleOtpVerification} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="text-center"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;