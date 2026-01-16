import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";

interface BusinessHour {
  open: string;
  close: string;
  active: boolean;
}

interface OnboardingStep2Props {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: { [key: string]: BusinessHour };
}

const daysOfWeek = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

export const OnboardingStep2 = ({ onNext, onBack, initialData }: OnboardingStep2Props) => {
  const [hours, setHours] = useState<{ [key: string]: BusinessHour }>(
    initialData || {
      monday: { open: "08:00", close: "18:00", active: true },
      tuesday: { open: "08:00", close: "18:00", active: true },
      wednesday: { open: "08:00", close: "18:00", active: true },
      thursday: { open: "08:00", close: "18:00", active: true },
      friday: { open: "08:00", close: "18:00", active: true },
      saturday: { open: "08:00", close: "13:00", active: true },
      sunday: { open: "08:00", close: "13:00", active: false },
    }
  );

  const handleChange = (day: string, field: keyof BusinessHour, value: string | boolean) => {
    setHours({
      ...hours,
      [day]: { ...hours[day], [field]: value },
    });
  };

  const handleSubmit = () => {
    onNext({ businessHours: hours });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Horários de Funcionamento</h2>
        <p className="text-muted-foreground">Defina quando sua distribuidora estará disponível</p>
      </div>

      <div className="space-y-3">
        {daysOfWeek.map((day) => (
          <Card key={day.key} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start sm:min-w-[180px] gap-4">
                <Label className="font-medium min-w-[120px]">{day.label}</Label>
                <Switch
                  checked={hours[day.key]?.active}
                  onCheckedChange={(checked) => handleChange(day.key, "active", checked)}
                />
              </div>

              {hours[day.key]?.active && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={hours[day.key]?.open || ""}
                    onChange={(e) => handleChange(day.key, "open", e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">às</span>
                  <Input
                    type="time"
                    value={hours[day.key]?.close || ""}
                    onChange={(e) => handleChange(day.key, "close", e.target.value)}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handleSubmit} size="lg">Próximo</Button>
      </div>
    </div>
  );
};
