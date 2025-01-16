import React, { useState } from "react";
import moment, { Moment } from "moment";
import './CalendarStyle.css';

moment.locale('es-DO');

interface CalendarProps {
  allowedDays: string[]; // Los días permitidos, como ["Domingo", "Lunes", "Miércoles"]
  onDateSelect: (date: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ allowedDays, onDateSelect }) => {
  const daysMap: { [key: string]: number } = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miercoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  const allowedDaysIndexes: number[] = allowedDays.map((day) => daysMap[day]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Moment>(moment());

  const getDaysInMonth = (month: number, year: number): { date: string; dayOfWeek: number; isAvailable: boolean }[] => {
    const startOfMonth = moment({ year, month }).startOf("month");
    const endOfMonth = moment({ year, month }).endOf("month");

    let days: { date: string; dayOfWeek: number; isAvailable: boolean }[] = [];

    const startDay = startOfMonth.day();
    const daysBefore = startDay === 0 ? 0 : startDay;

    for (let i = 0; i < daysBefore; i++) {
      days.push({ date: "", dayOfWeek: -1, isAvailable: false });
    }

    for (let date = startOfMonth; date.isBefore(endOfMonth, "day"); date.add(1, "days")) {
      days.push({
        date: date.format("YYYY-MM-DD"),
        dayOfWeek: date.day(),
        isAvailable: allowedDaysIndexes.includes(date.day()),
      });
    }

    return days;
  };

  const daysInMonth = getDaysInMonth(currentMonth.month(), currentMonth.year());

  const nextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  const prevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const handleDateSelection = (date: { date: string; isAvailable: boolean }) => {
    if (date.isAvailable) {
      setSelectedDate(date.date);
      onDateSelect(date.date);
    }
  };

  const renderDaysOfWeek = () => {
    const allDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return allDays.map((day) => (
      <div key={day} className="calendar-day-name">
        {day}
      </div>
    ));
  };

  return (
    <div>
      <p><strong>Las fechas en VERDE estan disponibles para agendar, selecciona la fecha deseada y luego la hora</strong></p>
      <br />
      <div className="calendar-header">
        <button type="button" onClick={prevMonth}>←</button>
        <h2>{currentMonth.format("MMMM YYYY")}</h2>
        <button type="button" onClick={nextMonth}>→</button>
      </div>

      <div className="calendar-days-of-week">{renderDaysOfWeek()}</div>

      <div className="calendar-grid">
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={`calendar-day 
              ${day.isAvailable ? "available" : "unavailable"} 
              ${selectedDate === day.date ? "selected" : ""}
              ${day.date === "" ? "empty" : ""}`}
            onClick={() => day.date && handleDateSelection(day)}
          >
            {day.date ? moment(day.date).date() : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;