import { api } from "@/lib/axios"
import { ApiResponse } from "@/type/api"
import type {
  GuestBookCreateRequest,
  GuestBookCreateResponse,
} from "@/type/guestbook"

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",")
  const mimeMatch = header.match(/data:(.*);base64/)
  const mime = mimeMatch?.[1] ?? "application/octet-stream"
  const binary = atob(base64)
  const len = binary.length
  const u8 = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) {
    u8[i] = binary.charCodeAt(i)
  }
  return new File([u8], filename, { type: mime })
}

export async function createGuestBook(payload: GuestBookCreateRequest): Promise<GuestBookCreateResponse> {
  const formData = new FormData()
  formData.append("name", payload.name ?? "")
  formData.append("origin", payload.origin ?? "")
  formData.append("purpose", payload.purpose ?? "")
  formData.append("reason", payload.reason ?? "")

  if (payload.selfie_image) {
    formData.append("selfie_image", dataUrlToFile(payload.selfie_image, "selfie.png"))
  }

  if (payload.signature_image) {
    formData.append("signature_image", dataUrlToFile(payload.signature_image, "signature.png"))
  }

  const { data } = await api.post<ApiResponse<GuestBookCreateResponse>>(
    "/public/guestbook",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  )
  return data.data
}
