"use client"

import { CreateGuestBookForm } from "@/features/root/components/form/CreateGuestBookForm"

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-[url('/Background%20BMU%20Update.png')] bg-cover bg-center bg-no-repeat pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl p-8 shadow-2xl border border-white/30 bg-white/10 backdrop-blur-xl backdrop-saturate-150">
          <p className="text-sm font-semibold uppercase tracking-wide text-white">
            Digital Guest Book
          </p>
          <img className="h-12 w-auto" src="/Logo BMU Horizontal.png" alt="Logo BMU" />
          <h1 className="mt-2 text-3xl font-bold text-white">Record visitor presence easily</h1>
          <p className="mt-2 max-w-2xl text-sm text-white">
            Fill in identity, purpose, reason, selfie, and signature. Data is sent securely via React Query &
            Axios as multipart/form-data.
          </p>
        </div>

        <CreateGuestBookForm />
      </div>
    </div>
  )
}
