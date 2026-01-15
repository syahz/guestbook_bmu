"use client"

import { CreateGuestBookForm } from "@/features/root/components/form/CreateGuestBookForm"

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-blue-50 pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Digital Guest Book
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Record visitor presence easily</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Fill in identity, purpose, reason, selfie, and signature. Data is sent securely via React Query &
            Axios as multipart/form-data.
          </p>
        </div>

        <CreateGuestBookForm />
      </div>
    </div>
  )
}
