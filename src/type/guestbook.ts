export type GuestBookCreateRequest = {
  name: string
  origin: string
  purpose: string
  reason: string
  selfie_image: string
  signature_image: string
}

export type GuestBookCreateResponse = {
  id?: string
  name: string
  origin: string
  purpose: string
  reason?: string
  selfie_image: string
  signature_image: string
  created_at?: string
}
