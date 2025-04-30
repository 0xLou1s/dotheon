import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ChevronRight, Play } from "lucide-react";

const beginnerLessons = [
  {
    id: 1,
    title: "Stake DOT to get vDOT",
    description: "Lesson 1: Getting Started",
    content:
      "Learn how to stake DOT on Bifrost to receive vDOT and start earning yield.",
    duration: "5 minutes",
  },
  {
    id: 2,
    title: "Claim rewards from SLP",
    description: "Lesson 2: Collecting Rewards",
    content:
      "Learn how to claim rewards from Bifrost SLP and manage your rewards.",
    duration: "3 minutes",
  },
  {
    id: 3,
    title: "Provide Liquidity",
    description: "Lesson 3: Joining Liquidity Pools",
    content:
      "Learn how to provide liquidity to pools on Bifrost to earn additional rewards.",
    duration: "7 minutes",
    completed: false,
  },
];

const nextLessons = [
  {
    id: 4,
    title: "Understanding vsBond",
    description: "Lesson 4: Using vsBond",
    content: "Learn about vsBond and how to use them in the Bifrost ecosystem.",
    duration: "8 minutes",
    completed: false,
  },
  {
    id: 5,
    title: "Farming with vToken",
    description: "Lesson 5: Advanced Yield Farming",
    content: "Learn how to optimize your yield through farming with vTokens.",
    duration: "10 minutes",
    completed: false,
    locked: true,
  },
];

export default function GuidePage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">DeFi Guide</h1>
          <p className="text-muted-foreground">
            Learn how to use DeFi on Bifrost
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Learning progress:
          </div>
          <Progress value={0} className="w-[100px]" />
          <div className="text-sm font-medium">30%</div>
        </div>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="beginner" className="space-y-6">
          <TabsList>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="beginner" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {beginnerLessons.map((lesson) => (
                <Card key={lesson.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="truncate max-w-[200px]">
                        {lesson.title}
                      </CardTitle>
                      {lesson.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <p className="text-sm">{lesson.content}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Play className="h-4 w-4" />
                        <span>Duration: {lesson.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled>
                      Coming soon...
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Next Lessons</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {nextLessons.map((lesson) => (
                  <Card key={lesson.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="truncate max-w-[200px]">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription>{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2">
                        <p className="text-sm">{lesson.content}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Play className="h-4 w-4" />
                          <span>Duration: {lesson.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" disabled>
                        Coming soon...
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="intermediate">
            <div className="rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">
                Complete the beginner lessons first
              </h3>
              <p className="text-muted-foreground mb-4">
                You need to complete all beginner lessons to unlock this
                content.
              </p>
              <Button disabled>Coming soon...</Button>
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">
                Complete the intermediate lessons first
              </h3>
              <p className="text-muted-foreground mb-4">
                You need to complete all intermediate lessons to unlock this
                content.
              </p>
              <Button disabled>Coming soon...</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
