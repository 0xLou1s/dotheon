import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { AppearanceForm } from "./appearance-form";
import { ThemePresetSelector } from "@/components/theme/theme-preset-selector";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6 px-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <AppearanceForm />
        </Card>

        <Card className="p-6">
          <ThemePresetSelector />
        </Card>
      </div>
    </div>
  );
}
