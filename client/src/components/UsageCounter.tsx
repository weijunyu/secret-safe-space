import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";

import { getUsage } from "../lib/api";

const UsageCounterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function UsageCounter() {
  const [usageCount, setUsageCount] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsage()
      .then((usage) => setUsageCount(usage.total))
      .catch(() => setUsageCount(-1))
      .finally(() => setLoading(false));
  }, []);

  function renderCounter() {
    if (loading) {
      return <CircularProgress size="1.5rem" />;
    } else if (usageCount === -1) {
      return null;
    } else {
      return <small>{usageCount} secrets exchanged</small>;
    }
  }

  return <UsageCounterContainer>{renderCounter()}</UsageCounterContainer>;
}
