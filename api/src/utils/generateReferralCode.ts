export async function generateReferralCode(fullname: string) {
  return (
    fullname.toUpperCase().replace(/\s+/g, "").slice(0, 4) +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}
