import React from "react";
import styled from "styled-components";

// From date-fns:
// Format full duration
// formatDuration({
//   years: 2,
//   months: 9,
//   weeks: 1,
//   days: 7,
//   hours: 5,
//   minutes: 9,
//   seconds: 30
// })

const StyledDurationPickerContainer = styled.div`
  display: flex;
`;

const StyledDurationSelection = styled.div`
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

export default function DurationPicker({
  onConfirm,
}: {
  onConfirm: (duration: number) => void;
}) {
  return (
    <StyledDurationPickerContainer>
      <StyledDurationSelection>
        <label htmlFor="duration-pocker-hours">Hours</label>
        <select id="duration-picker-hours">
          {Hours.map((h) => (
            <option value={h} key={h}>
              {h}
            </option>
          ))}
        </select>
      </StyledDurationSelection>
      <StyledDurationSelection>
        <label htmlFor="duration-pocker-minutes">Minutes</label>
        <select id="duration-picker-minutes">
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
