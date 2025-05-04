export const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith("0") && phone.length === 10) {
      return `+256${phone.slice(1)}`;
    }
    return phone; // Return the phone number as-is if it doesn't match the criteria
  };