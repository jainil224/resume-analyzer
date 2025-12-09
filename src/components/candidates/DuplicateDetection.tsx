import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DuplicateDetectionProps {
  email: string;
  phone: string;
  currentCandidateId?: string;
}

export function DuplicateDetection({ email, phone, currentCandidateId }: DuplicateDetectionProps) {
  const [duplicates, setDuplicates] = useState<{ type: string; name: string }[]>([]);

  useEffect(() => {
    checkDuplicates();
  }, [email, phone]);

  const checkDuplicates = async () => {
    if (!email && !phone) {
      setDuplicates([]);
      return;
    }

    const foundDuplicates: { type: string; name: string }[] = [];

    // Check email duplicates
    if (email) {
      const { data: emailDupes } = await supabase
        .from("candidates")
        .select("id, name")
        .eq("email", email)
        .neq("id", currentCandidateId || "");

      emailDupes?.forEach(d => {
        foundDuplicates.push({ type: "email", name: d.name });
      });
    }

    // Check phone duplicates
    if (phone) {
      const { data: phoneDupes } = await supabase
        .from("candidates")
        .select("id, name")
        .eq("phone", phone)
        .neq("id", currentCandidateId || "");

      phoneDupes?.forEach(d => {
        if (!foundDuplicates.find(f => f.name === d.name)) {
          foundDuplicates.push({ type: "phone", name: d.name });
        }
      });
    }

    setDuplicates(foundDuplicates);
  };

  if (duplicates.length === 0) return null;

  return (
    <Alert variant="destructive" className="bg-warning/10 border-warning text-warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Duplicate Detected!</strong>
        <ul className="mt-1 text-sm">
          {duplicates.map((d, idx) => (
            <li key={idx}>
              Candidate "{d.name}" has the same {d.type}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}