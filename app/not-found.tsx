import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 h-screen w-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
}
