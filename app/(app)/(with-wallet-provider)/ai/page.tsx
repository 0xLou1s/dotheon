import { Chat } from "@/containers/ai-assistant";

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col gap-4 h-[90vh] lg:px-[10%]  py-[2rem]">
      <Chat />
    </div>
  );
}
