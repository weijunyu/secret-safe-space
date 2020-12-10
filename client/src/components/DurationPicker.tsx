import React, { useState } from "react";
import styled from "styled-components";
import { Duration } from "luxon";

const StyledDurationPickerContainer = styled.div`
  display: flex;
`;

const StyledDurationSelection = styled.div`
  label {
    padding-right: 0.5rem;
  }
  :not(:last-child) {
    margin-right: 1rem;
  }
`;

const Hours: number[] = [0];
for (let h = 0; h < 24; h++) {
  Hours.push(h + 1);
}
const Minutes: number[] = [0];
for (let m = 0; m < 60; m++) {
  Minutes.push(m + 1);
}

enum DurationType {
  Hour,
  Minute,
}

export default function DurationPicker(
  {
    initialDuration,
    onChange,
  }: {
    initialDuration: { hours: number; minutes: number };
    onChange: (duration: number) => void;
  } = {
    initialDuration: {
      hours: 0,
      minutes: 0,
    },
    onChange: () => {},
  }
) {
  const [hours, setHours] = useState(initialDuration.hours);
  const [minutes, setMinutes] = useState(initialDuration.minutes);

  function onDurationChange(durationType: DurationType) {
    return function (e: React.ChangeEvent<HTMLSelectElement>) {
      const newValue = parseInt(e.target.value);

      let newDurationInMs = 0;
      if (durationType === DurationType.Hour) {
        setHours(newValue);
        newDurationInMs = Duration.fromObject({
          hours: newValue,
          minutes,
        }).as("milliseconds");
      }
      if (durationType === DurationType.Minute) {
        setMinutes(newValue);
        newDurationInMs = Duration.fromObject({
          hours,
          minutes: newValue,
        }).as("milliseconds");
      }
      onChange(newDurationInMs);
    };
  }

  return (
    <StyledDurationPickerContainer>
      <StyledDurationSelection>
        <label htmlFor="duration-picker-hours">Hours</label>
        <select
          id="duration-picker-hours"
          value={hours}
          onChange={onDurationChange(DurationType.Hour)}
        >
          {Hours.map((h) => (
            <option value={h} key={h}>
              {h}
            </option>
          ))}
        </select>
      </StyledDurationSelection>
      <StyledDurationSelection>
        <label htmlFor="duration-picker-minutes">Minutes</label>
        <select
          id="duration-picker-minutes"
          value={minutes}
          onChange={onDurationChange(DurationType.Minute)}
        >
          {Minutes.map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
      </StyledDurationSelection>
    </StyledDurationPickerContainer>
  );
}
