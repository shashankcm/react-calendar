import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import "./styles.css";

export default function Calendar() {
  const weekDaysShort = moment.weekdaysShort();
  const dateObj = moment();
  const daysInMonth = useMemo(() => dateObj.daysInMonth(), [dateObj]);
  const [intialDayOfMonth, setIntialDayOfMonth] = useState();
  const [intialBlankDays, setInitialBlankDays] = useState([]);
  const [remainingDays, setRemainingDays] = useState([]);

  const fetchFirstDayOfMonth = (dateObj) => {
    return moment(dateObj).startOf("month").format("d");
  };

  const displayWeekDayNames = useMemo(
    () => weekDaysShort.map((day) => <th key={day}>{day}</th>),
    [weekDaysShort]
  );

  useEffect(() => {
    const firstDay = fetchFirstDayOfMonth(dateObj);
    setIntialDayOfMonth(firstDay);
  }, [dateObj]);

  useEffect(() => {
    /* const blankDays = new Array(intialDayOfMonth).fill(
      <td className="calendar-day empty">{""}</td>
    ); */
    let blankDays = [];
    for (let i = 0; i < intialDayOfMonth; i++) {
      blankDays.push(
        <td className="calendar-day empty" key={`blank-${i}`}>
          {""}
        </td>
      );
    }
    setInitialBlankDays(blankDays);
  }, [intialDayOfMonth]);

  useEffect(() => {
    let allDaysInAMonth = [];
    for (let date = 1; date <= daysInMonth; date++) {
      allDaysInAMonth.push(
        <td key={date} className="calendar-day">
          {date}
        </td>
      );
    }
    setRemainingDays(allDaysInAMonth);
  }, [daysInMonth]);

  let totalMonth = [...intialBlankDays, ...remainingDays];
  let rows = [],
    cells = [];

  totalMonth.forEach((row, index) => {
    if (index % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (index === totalMonth.length - 1) {
      rows.push(cells);
    }
  });

  let displayAllDates = rows.map((day, index) => <tr key={index}>{day}</tr>);

  return (
    <div className="calendar-date">
      <table className="calendar-day">
        <thead>
          <tr>{displayWeekDayNames}</tr>
        </thead>
        <tbody>{displayAllDates}</tbody>
      </table>
    </div>
  );
}
