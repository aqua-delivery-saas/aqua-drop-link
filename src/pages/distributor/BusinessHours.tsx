import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useDistributorBusinessHours, useSaveBusinessHours } from "@/hooks/useDistributor";

const DAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const DEFAULT_HOURS = [
  { day_of_week: 0, open_time: "08:00", close_time: "12:00", is_open: false },
  { day_of_week: 1, open_time: "08:00", close_time: "18:00", is_open: true },
  { day_of_week: 2, open_time: "08:00", close_time: "18:00", is_open: true },
  { day_of_week: 3, open_time: "08:00", close_time: "18:00", is_open: true },
  { day_of_week: 4, open_time: "08:00", close_time: "18:00", is_open: true },
  { day_of_week: 5, open_time: "08:00", close_time: "18:00", is_open: true },
  { day_of_week: 6, open_time: "08:00", close_time: "13:00", is_open: true },
];

interface LocalBusinessHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
}

const BusinessHours = () => {
  const { data: businessHours, isLoading } = useDistributorBusinessHours();
  const saveBusinessHours = useSaveBusinessHours();

  const [hours, setHours] = useState<LocalBusinessHour[]>(DEFAULT_HOURS);

  useEffect(() => {
    if (businessHours && businessHours.length > 0) {
      // Map database data to local state
      const mappedHours = DEFAULT_HOURS.map(defaultHour => {
        const dbHour = businessHours.find(h => h.day_of_week === defaultHour.day_of_week);
        if (dbHour) {
          return {
            day_of_week: dbHour.day_of_week,
            open_time: dbHour.open_time || "08:00",
            close_time: dbHour.close_time || "18:00",
            is_open: dbHour.is_open,
          };
        }
        return defaultHour;
      });
      setHours(mappedHours);
    }
  }, [businessHours]);

  const handleChange = (dayOfWeek: number, field: keyof LocalBusinessHour, value: string | boolean) => {
    setHours(hours.map(h => 
      h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h
    ));
  };

  const handleSave = async () => {
    await saveBusinessHours.mutateAsync(hours);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Horários - AquaDelivery</title>
      </Helmet>
      <div className="space-y-6 max-w-2xl">
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
              {hours.map((schedule) => (
                <div key={schedule.day_of_week} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 min-w-[140px]">
                    <Checkbox
                      id={`day-${schedule.day_of_week}`}
                      checked={schedule.is_open}
                      onCheckedChange={(checked) => 
                        handleChange(schedule.day_of_week, "is_open", checked as boolean)
                      }
                    />
                    <Label htmlFor={`day-${schedule.day_of_week}`} className="cursor-pointer font-medium">
                      {DAY_NAMES[schedule.day_of_week]}
                    </Label>
                  </div>
                  {schedule.is_open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={schedule.open_time}
                        onChange={(e) => handleChange(schedule.day_of_week, "open_time", e.target.value)}
                        className="flex-1 sm:w-32 sm:flex-none"
                      />
                      <span className="text-muted-foreground text-sm">até</span>
                      <Input
                        type="time"
                        value={schedule.close_time}
                        onChange={(e) => handleChange(schedule.day_of_week, "close_time", e.target.value)}
                        className="flex-1 sm:w-32 sm:flex-none"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Fechado</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

        <Button 
          onClick={handleSave} 
          size="lg" 
          className="w-full"
          disabled={saveBusinessHours.isPending}
        >
          {saveBusinessHours.isPending ? "Salvando..." : "Salvar Horários"}
        </Button>
      </div>
    </div>
    </>
  );
};

export default BusinessHours;