import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EmptyState() {
  return (
    <div className="flex flex-col justify-center items-center h-[70%] space-y-6">
      <div className="flex flex-col justify-center items-center h-full space-y-6">
        <div className="relative">
          <Avatar className="size-12">
            <AvatarImage src="/assets/logo.jpg" className="object-cover" />
            <AvatarFallback>Dotheon</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-3 max-w-md">
          <h2 className="text-2xl font-light tracking-wide">Welcome</h2>

          <p className="text-foreground leading-relaxed font-light">
            No messages yet. Start a conversation with the assistant to begin
            your journey.
          </p>

          <div className="pt-4">
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
