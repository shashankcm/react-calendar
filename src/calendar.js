import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import "./styles.css";

export default function Calendar() {
  const weekDaysShort = moment.weekdaysShort();
  const allMonths = moment.months();
  const [dateObj, setDateObj] = useState(moment());
  const [currentYear, setCurrentYear] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [today, setToday] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [daysInMonth, setDaysInMonth] = useState();
  const [intialDayOfMonth, setIntialDayOfMonth] = useState();
  const [intialBlankDays, setInitialBlankDays] = useState([]);
  const [remainingDays, setRemainingDays] = useState([]);
  const [showMonthTable, setShowMonthTable] = useState(false);
  const [showYearTable, setShowYearTable] = useState(false);
  const [selectedTab, setSelectedTab] = useState("month");

  const fetchFirstDayOfMonth = (dateObj) => {
    return moment(dateObj).startOf("month").format("d");
  };

  const displayWeekDayNames = useMemo(
    () =>
      weekDaysShort.map((day) => (
        <th className="calendar-week date-select" key={day}>
          <span>{day}</span>
        </th>
      )),
    [weekDaysShort]
  );

  useEffect(() => {
    setCurrentMonth(dateObj.format("MMMM"));
    setCurrentYear(dateObj.format("Y"));
    setDaysInMonth(dateObj.daysInMonth());
    setToday(dateObj.format("DD"));
  }, [dateObj]);

  useEffect(() => {
    const firstDay = fetchFirstDayOfMonth(dateObj);
    setIntialDayOfMonth(firstDay);
  }, [dateObj]);

  useEffect(() => {
    let blankDays = [];
    for (let i = 0; i < intialDayOfMonth; i++) {
      blankDays.push(
        <td className="calendar-day date-disabled" key={`blank-${i}`}></td>
      );
    }
    setInitialBlankDays(blankDays);
  }, [intialDayOfMonth]);

  useEffect(() => {
    let allDaysInAMonth = [];
    for (let date = 1; date <= daysInMonth; date++) {
      const currDate = parseInt(today) === date;
      const selDate = parseInt(selectedDate) === date;
      allDaysInAMonth.push(
        <td key={date} className={"calendar-day date-select"}>
          <span
            onClick={handleDayClick}
            style={{
              ...(currDate && { backgroundColor: "yellow" }),
              ...(selDate && { backgroundColor: "lightGreen" })
            }}
          >
            {date}
          </span>
        </td>
      );
    }
    setRemainingDays(allDaysInAMonth);
  }, [daysInMonth, today, selectedDate]);

  const handleDayClick = (event) => {
    setSelectedDate(event.target.innerText);
  };

  const handleSetMonth = (event) => {
    const monthNumber = allMonths.indexOf(event.target.innerText);
    const tempDateObj = moment(dateObj).set("month", monthNumber);
    setDateObj(tempDateObj);
    handleMonthToggle();
  };

  const handleSetYear = (event) => {
    const yearNumber = event.target.innerText;
    const tempDateObj = moment(dateObj).set("year", yearNumber);
    setDateObj(tempDateObj);
    handleYearToggle();
    handleMonthToggle();
  };

  const handleMonthToggle = () => {
    setSelectedTab("month");
    setShowMonthTable(!showMonthTable);
  };

  const handleYearToggle = () => {
    setSelectedTab("year");
    setShowYearTable(!showYearTable);
  };

  const displayAllDates = () => {
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
    return rows.map((day, index) => <tr key={index}>{day}</tr>);
  };

  const displayAllMonths = () => {
    let months = [];
    allMonths.map((month) =>
      months.push(
        <td key={month} className="calendar-month" onClick={handleSetMonth}>
          <span>{month}</span>
        </td>
      )
    );
    let rows = [],
      cells = [];

    months.forEach((row, index) => {
      if (index % 3 !== 0 || index === 0) {
        //expect first month
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells); //add last row

    let monthList = rows.map((row, i) => <tr key={row}>{row}</tr>);
    return (
      <table>
        <tr>
          <th colSpan="4">Select a Month</th>
        </tr>
        {monthList}
      </table>
    );
  };

  const getDates = (startDate, endDate) => {
    let dateArr = [];
    let currentStartDate = moment(startDate);
    let currentEndDate = moment(endDate);
    while (currentStartDate <= currentEndDate) {
      dateArr.push(moment(currentStartDate).format("YYYY"));
      currentStartDate = moment(currentStartDate).add(1, "year");
    }
    return dateArr;
  };

  const displayYearsList = () => {
    let months = [];
    let currentYear = moment().format("Y");
    let nextYear = moment()
      .set("year", currentYear)
      .add("year", 12)
      .format("Y");
    let tenYears = getDates(currentYear, nextYear);
    tenYears.map((year) =>
      months.push(
        <td key={year}>
          <span className="calendar-year" onClick={handleSetYear}>
            {year}
          </span>
        </td>
      )
    );

    let rows = [],
      cells = [];

    months.forEach((row, index) => {
      if (index % 3 !== 0 || index === 0) {
        //expect first month
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells); //add last row
    let yearList = rows.map((row, i) => <tr>{row}</tr>);
    return (
      <table>
        <tr>
          <th colSpan="4">Select a Year</th>
        </tr>
        {yearList}
      </table>
    );
  };

  const onPrevClick = () => {
    const newDateObj = moment(dateObj).subtract(1, selectedTab);
    setDateObj(newDateObj);
    setShowMonthTable(false);
    setShowYearTable(false);
  };
  const onNextClick = () => {
    setDateObj(moment(dateObj).add(1, selectedTab));
    setShowMonthTable(false);
    setShowYearTable(false);
  };

  return (
    <div className="tail-datetime-calendar">
      <div className="calendar-datepicker">
        <div className="calendar-actions">
          <span className="action-prev" onClick={onPrevClick} />
          <span className="action-next" onClick={onNextClick} />
        </div>
        <table>
          <tr>
            <td className="calendar-month">
              <span onClick={handleMonthToggle}>{currentMonth}</span>
            </td>
            <td className="calendar-year">
              <span onClick={handleYearToggle}>{currentYear}</span>
            </td>
          </tr>
        </table>
      </div>
      {showMonthTable && (
        <div className="calendar-datepicker">{displayAllMonths()}</div>
      )}
      {showYearTable && (
        <div className="calendar-datepicker">{displayYearsList()}</div>
      )}
      {(!showMonthTable || !showYearTable) && (
        <div className="calendar-datepicker">
          <table>
            <tr>{displayWeekDayNames}</tr>
            {displayAllDates()}
          </table>
        </div>
      )}
    </div>
  );
}
