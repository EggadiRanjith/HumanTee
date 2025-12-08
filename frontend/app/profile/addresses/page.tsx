"use client";

import { useState } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";

/* --------------------------
   ADDRESS TYPE
--------------------------- */
interface Address {
  id: string;
  firstName: string;
  lastName: string;
  line1: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

/* --------------------------
   INITIAL DEMO DATA
--------------------------- */
const initialAddresses: Address[] = [
  {
    id: "addr-1",
    firstName: "John",
    lastName: "Carter",
    line1: "221B Baker Street",
    city: "London",
    state: "—",
    zip: "NW1 6XE",
    phone: "+91 9876543210",
    isDefault: true,
  },
  {
    id: "addr-2",
    firstName: "Elena",
    lastName: "Fischer",
    line1: "34 Rue de Sevigne",
    city: "Paris",
    state: "Île-de-France",
    zip: "75003",
    phone: "+91 9812345678",
  },
];

/* --------------------------
   INPUT CLASS
--------------------------- */
const inputClass = `
  w-full rounded-xl border border-white/12 bg-white/5
  px-4 py-3
  text-white/90 text-[13px]
  placeholder-white/35
  focus:border-white/20 outline-none
  transition-all
`;

/* --------------------------
   MAIN PAGE
--------------------------- */
export default function ShippingAddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<null | string>(null);

  // Form state
  const [formData, setFormData] = useState<Address>({
    id: "",
    firstName: "",
    lastName: "",
    line1: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: false,
  });

  /* --------------------------
     OPEN MODAL FOR NEW
  --------------------------- */
  const openNewModal = () => {
    setEditingId("new");
    setFormData({
      id: "addr-" + Math.random().toString(36).slice(2, 8),
      firstName: "",
      lastName: "",
      line1: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      isDefault: false,
    });
    setModalOpen(true);
  };

  /* --------------------------
     OPEN MODAL FOR EDIT
  --------------------------- */
  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setFormData(addr);
    setModalOpen(true);
  };

  /* --------------------------
     SUBMIT FORM
  --------------------------- */
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }

    if (editingId === "new") {
      setAddresses([...addresses, formData]);
    } else {
      setAddresses(addresses.map((a) => (a.id === editingId ? formData : a)));
    }

    setModalOpen(false);
  };

  /* --------------------------
     DELETE ADDRESS
  --------------------------- */
  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  /* --------------------------
     SET DEFAULT
  --------------------------- */
  const setDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen brand-bg px-4 sm:px-6 md:px-8 pb-20">
      <div className="max-w-screen-md mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[22px] sm:text-[28px] md:text-[34px] font-light uppercase tracking-[0.16em] text-white">
              Shipping Addresses
            </h1>
            <p className="text-white/45 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mt-2">
              Manage delivery destinations
            </p>
          </div>

          <button
            onClick={openNewModal}
            className="
              inline-flex items-center justify-center 
              rounded-xl border border-white/10 bg-white/5
              text-white/80 hover:text-white hover:bg-white/10
              px-5 py-3 uppercase tracking-[0.22em] text-[10px] sm:text-[11px]
            "
          >
            Add Address
          </button>
        </div>

        {/* ADDRESS LIST */}
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="
                p-5 sm:p-6 rounded-2xl luxury-glass 
                border border-white/10 bg-white/5 backdrop-blur-xl
              "
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-white text-sm sm:text-base font-light tracking-wide">
                      {a.firstName} {a.lastName}
                    </h2>

                    {a.isDefault && (
                      <span className="text-[10px] uppercase tracking-[0.22em] text-white/60 border border-white/15 rounded-full px-3 py-1">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm tracking-wide">
                    {a.line1}
                  </p>
                  {a.apartment && (
                    <p className="text-white/60 text-xs sm:text-sm tracking-wide">
                      {a.apartment}
                    </p>
                  )}
                  <p className="text-white/60 text-xs sm:text-sm tracking-wide">
                    {a.city}, {a.state}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm tracking-wide">
                    {a.zip}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm tracking-wide">
                    {a.phone}
                  </p>
                </div>
                
                {/* ACTION BAR — CENTER ON MOBILE, RIGHT ON DESKTOP */}
                <div
                className="
                    flex flex-wrap items-center justify-center
                    sm:justify-end
                    gap-4
                    text-[11px] uppercase tracking-[0.22em] 
                    text-white/60
                    pt-2
                "
                >
                <button
                    onClick={() => openEditModal(a)}
                    className="hover:text-white transition-colors"
                >
                    Edit
                </button>

                <span className="opacity-25">•</span>

                <button
                    onClick={() => deleteAddress(a.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                >
                    Delete
                </button>

                {!a.isDefault && (
                    <>
                    <span className="opacity-25">•</span>

                    <button
                        onClick={() => setDefault(a.id)}
                        className="hover:text-white transition-colors"
                    >
                        Set Default
                    </button>
                    </>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BACK LINK */}
        <div className="mt-12 text-center text-[11px] uppercase tracking-[0.18em] text-white/40">
          <Link href="/profile" className="hover:text-white/70">
            Back to profile
          </Link>
        </div>
      </div>

      {/* --------------------------
          MODAL
      --------------------------- */}
      {modalOpen && (
        <div
          className="
            fixed inset-0 bg-black/40 backdrop-blur-md
            z-[9000] flex items-center justify-center px-4 sm:px-6
          "
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-lg rounded-2xl luxury-glass
              border border-white/10 bg-white/5 backdrop-blur-2xl
              p-6 sm:p-8
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-white text-[18px] sm:text-[20px] uppercase tracking-[0.16em] font-light">
                {editingId === "new" ? "Add Address" : "Edit Address"}
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={submitForm} className="space-y-5 sm:space-y-6">
              {/* Default */}
              <label className="flex items-center gap-2 text-white/70 text-xs">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                />
                Make this my default address
              </label>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className={inputClass}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />

                <input
                  className={inputClass}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Address */}
              <input
                className={inputClass}
                placeholder="Address"
                value={formData.line1}
                onChange={(e) =>
                  setFormData({ ...formData, line1: e.target.value })
                }
                required
              />

              {/* Apt */}
              <input
                className={inputClass}
                placeholder="Apartment, suite, etc (optional)"
                value={formData.apartment}
                onChange={(e) =>
                  setFormData({ ...formData, apartment: e.target.value })
                }
              />

              {/* City / State / Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  className={inputClass}
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="PIN Code"
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-[90px] sm:w-[110px]
                    rounded-xl border border-white/12 bg-white/5
                    text-white/80 text-[13px] py-3 flex items-center justify-center
                  "
                >
                  🇮🇳 +91
                </div>

                <input
                  className={`${inputClass} flex-1`}
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="
                    flex-1 rounded-xl py-3
                    border border-white/10
                    text-white/60 text-[11px] uppercase tracking-[0.22em]
                    hover:bg-white/5
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1 rounded-xl py-3
                    bg-white text-black text-[11px]
                    uppercase tracking-[0.22em]
                  "
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
