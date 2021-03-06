import React, { useState, useMemo, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight, MdSync } from 'react-icons/md';
import { toast } from 'react-toastify';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { utcToZonedTime } from 'date-fns-tz';
import api from '~/services/api';
import { Container, Time, Loading } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [fetching, setFetching] = useState(true);

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadSchedule() {
      setFetching(true);
      try {
        const response = await api.get('schedules', {
          params: { date },
        });

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const data = range.map(hour => {
          const checkDate = setSeconds(setMinutes(setHours(date, hour), 0), 0);
          const compareDate = utcToZonedTime(checkDate, timezone);

          return {
            time: `${hour}:00h`,
            past: isBefore(compareDate, new Date()),
            appointment: response.data.find(s =>
              isEqual(parseISO(s.date), compareDate)
            ),
          };
        });
        setSchedule(data);
      } catch (error) {
        toast.error(error.message);
      }
      setFetching(false);
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  return (
    <Container>
      <header>
        <button onClick={handlePrevDay} type="button" disabled={fetching}>
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button onClick={handleNextDay} type="button" disabled={fetching}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>

      {fetching ? (
        <Loading>
          <MdSync size={36} color="#fff" />
        </Loading>
      ) : (
        <ul>
          {schedule.map(time => (
            <Time
              key={time.time}
              past={time.past}
              available={!time.appointment}
            >
              <strong>{time.time}</strong>
              <span>
                {time.appointment ? time.appointment.user.name : 'Em aberto'}
              </span>
            </Time>
          ))}
        </ul>
      )}
    </Container>
  );
}
