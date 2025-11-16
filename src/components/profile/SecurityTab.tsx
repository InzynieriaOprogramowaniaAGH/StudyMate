"use client";

import { useState } from "react";
import { PasswordSection } from "./PasswordSection";

export function SecurityTab() {
  return (
    <div className="space-y-6">
      {/* PASSWORD SECTION */}
      <PasswordSection />
    </div>
  );
}
