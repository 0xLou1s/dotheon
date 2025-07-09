import { Chat } from "@/containers/ai-assistant";

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col gap-4 h-[85vh] lg:px-[10%]  pb-[1rem]">
      <Chat />
    </div>
  );
}
