import { Activity } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-2">
      <Activity className="animate-spin text-red-600 w-12 h-12" />
    </div>
  );
}
