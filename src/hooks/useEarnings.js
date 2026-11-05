import { useMemo } from 'react';

export default function useEarnings(trips) {
  return useMemo(() => {
    const now = new Date();
    const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startWeek = new Date(startDay);
    startWeek.setDate(startDay.getDate() - ((startDay.getDay() + 6) % 7));
    
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const summarize = start => {
      const list = trips.filter(t => t.completedAt && new Date(t.completedAt) >= start);
      const totalFare = list.reduce((sum, t) => sum + (t.fare || 0), 0);
      const commission = list.reduce((sum, t) => sum + (t.commission || 0), 0);
      const tips = list.reduce((sum, t) => sum + (t.tip || 0), 0);
      const net = list.reduce((sum, t) => sum + (t.driverEarnings || 0), 0);

      return {
        count: list.length,
        totalFare,
        commission,
        tips,
        net,
        average: list.length ? Math.round(net / list.length) : 0,
      };
    };

    return {
      today: summarize(startDay),
      week: summarize(startWeek),
      month: summarize(startMonth),
    };
  }, [trips]);
}