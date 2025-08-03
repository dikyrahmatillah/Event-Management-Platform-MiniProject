import { Input } from "@/components/ui/atomic/input";

export default function IDRCurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const parsed = parseInt(raw || "0", 10);
    onChange(parsed);
  };

  return (
    <Input
      type="text"
      value={`Rp ${value.toLocaleString("id-ID")}`}
      onChange={handleChange}
    />
  );
}
