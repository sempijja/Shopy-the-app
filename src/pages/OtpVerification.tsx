
// Add phone property to verifyOtp call
const { data, error } = await supabase.auth.verifyOtp({
  phone: phone, // Add missing phone property
  token: otp,
  type: "sms"
});
