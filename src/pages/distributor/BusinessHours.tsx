import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  active: boolean;
}

const BusinessHours = () => {
  const [hours, setHours] = useState<BusinessHour[]>([
    { day: "Segunda-feira", open: "08:00", close: "18:00", active: true },
    { day: "Terça-feira", open: "08:00", close: "18:00", active: true },
    { day: "Quarta-feira", open: "08:00", close: "18:00", active: true },
    { day: "Quinta-feira", open: "08:00", close: "18:00", active: true },
    { day: "Sexta-feira", open: "08:00", close: "18:00", active: true },
    { day: "Sábado", open: "08:00", close: "13:00", active: true },
    { day: "Domingo", open: "08:00", close: "12:00", active: false },
  ]);

  const handleChange = (index: number, field: keyof BusinessHour, value: string | boolean) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const handleSave = () => {
    toast.success("Horários atualizados com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Horário de Atendimento</h1>
          <p className="text-muted-foreground">Configure os dias e horários de funcionamento</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dias e Horários</CardTitle>
              <CardDescription>
                Defina quando sua distribuidora realiza entregas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hours.map((schedule, index) => (
                <div key={schedule.day} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 min-w-[140px]">
                    <Checkbox
                      id={`day-${index}`}
                      checked={schedule.active}
                      onCheckedChange={(checked) => 
                        handleChange(index, "active", checked as boolean)
                      }
                    />
                    <Label htmlFor={`day-${index}`} className="cursor-pointer font-medium">
                      {schedule.day}
                    </Label>
                  </div>
                  {schedule.active ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={schedule.open}
                        onChange={(e) => handleChange(index, "open", e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input
                        type="time"
                        value={schedule.close}
                        onChange={(e) => handleChange(index, "close", e.target.value)}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Fechado</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={handleSave} size="lg" className="w-full">
            Salvar Horários
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BusinessHours;
