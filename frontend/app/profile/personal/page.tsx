"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import Link from "next/link";

export default function PersonalInformationPage() {
  const [isOpen, setIsOpen] = useState(false);

  // USER DATA — STORED IN STATE SO MODAL CAN DISPLAY + EDIT IT
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
  });

  return (
    <div className="min-h-screen brand-bg px-4 sm:px-6 md:px-8 pb-20 pt-[var(--header-height)]">

      <div className="max-w-screen-sm mx-auto">

        {/* TITLE */}
        <div className="mb-12">
          <h1
            className="
              text-[22px] sm:text-[28px] md:text-[34px]
              font-light uppercase tracking-[0.16em]
              text-white leading-tight
            "
          >
            Personal Information
          </h1>

          <p
            className="
              text-white/45 text-[10px] sm:text-[11px]
              uppercase tracking-[0.22em] mt-2
            "
          >
            Manage your account details
          </p>
        </div>

        {/* INFORMATION CARD */}
        <div
          className="
            p-6 sm:p-7 rounded-2xl luxury-glass
            border border-white/10 bg-white/5 backdrop-blur-xl
            space-y-5
          "
        >
          <DisplayRow label="First Name" value={user.firstName} />
          <DisplayRow label="Last Name" value={user.lastName} />
          <DisplayRow label="Email" value={user.email} />
          <DisplayRow label="Phone" value={user.phone} />

          {/* EDIT BUTTON */}
          <button
            onClick={() => setIsOpen(true)}
            className="
              w-full rounded-xl bg-white text-black
              uppercase tracking-[0.22em]
              text-[11px] sm:text-[12px]
              py-3 sm:py-3.5 mt-2
            "
          >
            Edit Information
          </button>

          {/* BACK LINK */}
          <div className="pt-2 text-center text-[11px] text-white/40 uppercase tracking-[0.18em]">
            <Link href="/profile" className="hover:text-white/70">
              Back to profile overview
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <EditModal
          user={user}
          setUser={setUser}
          close={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

/* ========= DISPLAY ROW ========== */
function DisplayRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/50 text-[10px] uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="text-white text-sm sm:text-base mt-1">{value}</p>
    </div>
  );
}

/* ========= EDIT MODAL (PREFILLED) ========== */
function EditModal({
  user,
  setUser,
  close,
}: {
  user: any;
  setUser: any;
  close: () => void;
}) {
  const update = (field: string, value: string) => {
    setUser((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="
        fixed inset-0 z-[9000]
        flex items-center justify-center
        px-4
      "
    >
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={close}
      />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-md
          p-6 sm:p-7 rounded-2xl luxury-glass
          border border-white/10 bg-white/5 backdrop-blur-xl
          space-y-6 z-[9100]
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="
            text-white text-[18px] sm:text-[20px]
            uppercase tracking-[0.16em] font-light
          ">
            Edit Information
          </h2>

          <button onClick={close} className="text-white/70 hover:text-white">
            <FiX size={22} />
          </button>
        </div>

        {/* FORM */}
        <Field
          label="First Name"
          value={user.firstName}
          onChange={(e: any) => update("firstName", e.target.value)}
        />
        <Field
          label="Last Name"
          value={user.lastName}
          onChange={(e: any) => update("lastName", e.target.value)}
        />
        <Field
          label="Email"
          value={user.email}
          onChange={(e: any) => update("email", e.target.value)}
        />
        <Field
          label="Phone"
          value={user.phone}
          onChange={(e: any) => update("phone", e.target.value)}
        />

        {/* SAVE */}
        <button
          onClick={close}
          className="
            w-full rounded-xl bg-white text-black
            uppercase tracking-[0.22em]
            text-[11px] sm:text-[12px]
            py-3 sm:py-3.5 mt-1
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ========= FIELD COMPONENT ========== */
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: any;
}) {
  return (
    <div className="space-y-2">
      <label className="text-white/70 text-xs uppercase tracking-[0.16em]">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="
          w-full rounded-xl border border-white/10
          bg-white/5 backdrop-blur-xl
          px-4 py-3 text-white
          placeholder-white/40
          focus:outline-none focus:border-white/30
        "
      />
    </div>
  );
}
