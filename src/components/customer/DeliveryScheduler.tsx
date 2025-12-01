import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessHour {
  dia_semana: string;
  hora_abertura: string;
  hora_fechamento: string;
  ativo: boolean;
}

interface DeliverySchedulerProps {
  businessHours: BusinessHour[];
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

const weekDayMap: Record<string, number> = {
  'domingo': 0,
  'segunda-feira': 1,
  'terça-feira': 2,
  'quarta-feira': 3,
  'quinta-feira': 4,
  'sexta-feira': 5,
  'sábado': 6,
};

export const DeliveryScheduler = ({
  businessHours,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
}: DeliverySchedulerProps) => {
  
  // Gerar slots de horário baseado no dia selecionado
  const generateTimeSlots = (): string[] => {
    if (!selectedDate) return [];

    const dayName = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    const schedule = businessHours.find(
      s => s.dia_semana.toLowerCase() === dayName.toLowerCase() && s.ativo
    );

    if (!schedule) return [];

    const slots: string[] = [];
    const [startHour, startMin] = schedule.hora_abertura.split(':').map(Number);
    const [endHour, endMin] = schedule.hora_fechamento.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeSlot);
      
      currentMin += 60; // Slots de 1 hora
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }
    }

    return slots;
  };

  // Função para desabilitar dias no calendário
  const isDateDisabled = (date: Date): boolean => {
    // Desabilitar dias passados e hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date <= today) return true;

    // Desabilitar dias que a distribuidora está fechada
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const schedule = businessHours.find(
      s => s.dia_semana.toLowerCase() === dayName.toLowerCase()
    );

    return !schedule || !schedule.ativo;
  };

  const timeSlots = generateTimeSlots();
  const currentSchedule = selectedDate 
    ? businessHours.find(
        s => s.dia_semana.toLowerCase() === selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase()
      )
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Escolher Data e Horário
          </CardTitle>
          <CardDescription>
            Selecione o dia e horário de sua preferência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Data da Entrega</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                disabled={isDateDisabled}
                className={cn("rounded-md border pointer-events-auto")}
                initialFocus
              />
            </div>
            {selectedDate && currentSchedule && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Badge>
                <span>•</span>
                <span>
                  Atendimento: {currentSchedule.hora_abertura} às {currentSchedule.hora_fechamento}
                </span>
              </div>
            )}
          </div>

          {selectedDate && timeSlots.length > 0 && (
            <div className="space-y-3">
              <Label>Horário da Entrega</Label>
              <Select value={selectedTime} onValueChange={onTimeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedDate && timeSlots.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum horário disponível para este dia
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
