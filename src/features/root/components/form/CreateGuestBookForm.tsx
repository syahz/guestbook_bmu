"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle2, FileText, Loader2, MapPin } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { SelfieCapture } from "@/features/root/components/SelfieCapture"
import { SignaturePad } from "@/features/root/components/SignaturePad"
import { useGuestBookCreate } from "@/features/root/hooks/useGuestBookCreate"
import type { GuestBookCreateRequest } from "@/type/guestbook"
import { isAxiosError } from "axios"

const purposeOptions = [
  "President Director",
  "Chief Operating Officer",
  "Chief Financial and Risk Officer",
  "Corporate Secretary",
  "Finance Staff",
  "General Affairs Staff",
  "Human Resources Staff",
  "Administration Staff",
  "IT Staff",
  "Legal Staff",
  "Operations Staff",
  "Social Media Staff",
  "Other",
]

const guestBookSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    origin: z.string().min(2, "Company / organization is required"),
    purpose: z.string().min(1, "Purpose is required"),
    purpose_other: z.string().optional(),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
    selfie_image: z.string().min(1, "Selfie photo is required"),
    signature_image: z.string().min(1, "Signature is required"),
  })
  .superRefine((val, ctx) => {
    if (val.purpose === "Other" && !val.purpose_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["purpose_other"],
        message: "Please specify your target contact",
      })
    }
  })

type GuestBookFormValues = z.infer<typeof guestBookSchema>

export function CreateGuestBookForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GuestBookFormValues>({
    resolver: zodResolver(guestBookSchema),
    defaultValues: {
      name: "",
      origin: "",
      purpose: "",
      purpose_other: "",
      reason: "",
      selfie_image: "",
      signature_image: "",
    },
  })

  const mutation = useGuestBookCreate()
  const [showSuccess, setShowSuccess] = useState(false)

  const selfieImage = useWatch({ control, name: "selfie_image" }) ?? ""
  const signatureImage = useWatch({ control, name: "signature_image" }) ?? ""
  const purposeValue = useWatch({ control, name: "purpose" }) ?? ""

  const apiError = useMemo(() => {
    if (!mutation.error) return ""
    if (isAxiosError(mutation.error)) {
      return (
        (mutation.error.response?.data as { message?: string } | undefined)?.message ??
        "Failed to submit guest book"
      )
    }
    return "Failed to submit guest book"
  }, [mutation.error])

  const onSubmit = async (values: GuestBookFormValues) => {
    const payload: GuestBookCreateRequest = {
      name: values.name.trim(),
      origin: values.origin.trim(),
      purpose: values.purpose === "Other" ? values.purpose_other?.trim() ?? "" : values.purpose,
      reason: values.reason.trim(),
      selfie_image: values.selfie_image,
      signature_image: values.signature_image,
    }

    try {
      await mutation.mutateAsync(payload)
      setShowSuccess(true)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      reset()
    }
  }, [mutation.isSuccess, reset])

  const closeSuccessModal = () => {
    setShowSuccess(false)
  }

  return (
    <>
      {mutation.isSuccess && showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Thank you!</h3>
                <p className="text-sm text-white/80">Your guest book entry has been submitted.</p>
              </div>
            </div>
            <Button onClick={closeSuccessModal} className="w-full">
              Fill another entry
            </Button>
          </div>
        </div>
      )}

      {apiError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertCircle className="mt-0.5 size-5 text-red-500" />
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="text-red-800">{apiError}</p>
          </div>
        </div>
      )}

      <form
        className="rounded-2xl border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-white">
                <FileText className="size-5 text-blue-400" />
                <h2 className="text-lg font-semibold">Guest identity</h2>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/90">Full name</label>
                <input
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-inner placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/90">Company / organization</label>
                <input
                  {...register("origin")}
                  aria-invalid={!!errors.origin}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-inner placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Example: BMU, Partner, Government"
                />
                {errors.origin && <p className="text-sm text-red-400">{errors.origin.message}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="size-5 text-blue-400" />
                  <label className="text-sm font-medium">Who do you want to meet?</label>
                </div>
                <select
                  {...register("purpose")}
                  aria-invalid={!!errors.purpose}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 [&>option]:bg-slate-800"
                >
                  <option value="">Select purpose</option>
                  {purposeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {purposeValue === "Other" && (
                  <input
                    {...register("purpose_other")}
                    aria-invalid={!!errors.purpose_other}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-inner placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    placeholder="Specify the person / division"
                  />
                )}
                {errors.purpose && <p className="text-sm text-red-400">{errors.purpose.message}</p>}
                {errors.purpose_other && (
                  <p className="text-sm text-red-400">{errors.purpose_other.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/90">Reason for visit</label>
                <textarea
                  {...register("reason")}
                  aria-invalid={!!errors.reason}
                  rows={4}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-inner placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Describe your reason briefly"
                />
                {errors.reason && <p className="text-sm text-red-400">{errors.reason.message}</p>}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">1</span>
                <div>
                  <p className="text-sm font-semibold">Selfie photo</p>
                  <p className="text-xs text-white/60">Make sure your face is clearly visible.</p>
                </div>
              </div>
              <SelfieCapture
                value={selfieImage}
                onChange={(dataUrl) =>
                  setValue("selfie_image", dataUrl, { shouldDirty: true, shouldValidate: true })
                }
                error={errors.selfie_image?.message}
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">2</span>
                <div>
                  <p className="text-sm font-semibold">Digital signature</p>
                  <p className="text-xs text-white/60">Use mouse or touch to sign.</p>
                </div>
              </div>
              <SignaturePad
                value={signatureImage}
                onChange={(dataUrl) =>
                  setValue("signature_image", dataUrl, { shouldDirty: true, shouldValidate: true })
                }
                error={errors.signature_image?.message}
              />
            </section>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <div className="text-xs text-white/50">
            Data will be sent as multipart/form-data with selfie and signature attachments.
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="min-w-37.5"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" /> Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  )
}
