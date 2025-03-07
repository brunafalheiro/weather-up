import { useState, useEffect } from "react";
import { Moment } from "moment-timezone";
import moment from "moment-timezone";

const Clock = ({ timezone }: { timezone: string }) => {
  const [time, setTime] = useState<Moment>(moment().tz(timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().tz(timezone));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timezone]);

  return <p className="text-sm font-semibold">{time.format('MM-DD-YYYY')}</p>;
};

export default Clock;
