export interface BusinessHour {
  day_of_week: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { day_of_week: 0, is_open: false, open_time: null, close_time: null }, // Domingo
  { day_of_week: 1, is_open: true, open_time: '08:00', close_time: '18:00' },
  { day_of_week: 2, is_open: true, open_time: '08:00', close_time: '18:00' },
  { day_of_week: 3, is_open: true, open_time: '08:00', close_time: '18:00' },
  { day_of_week: 4, is_open: true, open_time: '08:00', close_time: '18:00' },
  { day_of_week: 5, is_open: true, open_time: '08:00', close_time: '18:00' },
  { day_of_week: 6, is_open: true, open_time: '08:00', close_time: '12:00' }, // Sábado
];

export function isDistributorOpen(businessHours?: BusinessHour[]): boolean {
  const hoursToCheck = !businessHours || businessHours.length === 0 
    ? DEFAULT_BUSINESS_HOURS 
    : businessHours;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);

  const todaySchedule = hoursToCheck.find(h => h.day_of_week === dayOfWeek);
  
  if (!todaySchedule || !todaySchedule.is_open) {
    return false;
  }

  const openTime = todaySchedule.open_time?.slice(0, 5);
  const closeTime = todaySchedule.close_time?.slice(0, 5);
  
  return !!(openTime && closeTime && currentTime >= openTime && currentTime <= closeTime);
}
