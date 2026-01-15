"use client"

import { useMutation } from "@tanstack/react-query"

import { createGuestBook } from "@/services/guestbook"
import type {
  GuestBookCreateRequest,
  GuestBookCreateResponse,
} from "@/type/guestbook"

export function useGuestBookCreate() {
  return useMutation<GuestBookCreateResponse, unknown, GuestBookCreateRequest>({
    mutationFn: createGuestBook,
  })
}
