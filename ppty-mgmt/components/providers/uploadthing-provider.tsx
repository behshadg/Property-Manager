"use client";

import { UploadDropzone } from "@uploadthing/react";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

interface UploadthingProviderProps {
  children: React.ReactNode;
}

export function UploadthingProvider({ children }: UploadthingProviderProps) {
  return children;
}