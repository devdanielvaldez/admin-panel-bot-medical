import React, { useState } from "react";
import moment, { Moment } from "moment";
import "./CalendarStyle.css";

moment.locale("es-DO");

interface CalendarProps {
  allowedDays: string[];
  onDateSelect: (date: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ allowedDays, onDateSelect }) => {
  const daysMap: { [key: string]: number } = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  const allowedDaysIndexes: number[] = allowedDays.map((day) => daysMap[day]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Moment>(moment());

  const getDaysInMonth = (
    month: number,
    year: number
  ): { date: string; dayOfWeek: number; isAvailable: boolean }[] => {
    const startOfMonth = moment({ year, month }).startOf("month");
    const endOfMonth = moment({ year, month }).endOf("month");

    let days: { date: string; dayOfWeek: number; isAvailable: boolean }[] = [];

    const startDay = startOfMonth.day();
    for (let i = 0; i < startDay; i++) {
      days.push({ date: "", dayOfWeek: -1, isAvailable: false });
    }

    for (
      let date = startOfMonth.clone();
      date.isSameOrBefore(endOfMonth, "day");
      date.add(1, "days")
    ) {
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

  const handleDateSelection = (day: { date: string; isAvailable: boolean }) => {
    if (day.isAvailable) {
      setSelectedDate(day.date);
      onDateSelect(day.date);
    }
  };

  const renderDaysOfWeek = () => {
    const allDays = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return allDays.map((day) => (
      <div key={day} className="calendar-day-name">
        {day.slice(0, 3)}
      </div>
    ));
  };

  return (
    <div className="calendar-container">
      <p className="calendar-info">
        Las fechas en{" "}
        <strong style={{ color: "var(--secondary-color)" }}>verde</strong> están
        disponibles para agendar. Selecciona la fecha deseada y luego la hora.
      </p>
      <div className="calendar-header">
        <button type="button" onClick={prevMonth}>
          ←
        </button>
        <h2>{currentMonth.format("MMMM YYYY")}</h2>
        <button type="button" onClick={nextMonth}>
          →
        </button>
      </div>

      <div className="calendar-days-of-week">{renderDaysOfWeek()}</div>

      <div className="calendar-grid">
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={
              "calendar-day " +
              (day.date === "" ? "empty " : "") +
              (!day.date || !day.isAvailable ? "unavailable " : "available ") +
              (selectedDate === day.date ? "selected" : "")
            }
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
