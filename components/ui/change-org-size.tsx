'use client'

import { testOrgSizeChange } from "@/actions/actions";

export default function ChangeOrgSize() {
  return (
    <button onClick={() => testOrgSizeChange()}>
      Change Org Size
    </button>
  );
}