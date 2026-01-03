"use client";

import { useState, FormEvent } from 'react';
import { GradientOverlay } from '@/app/components/ui/layout';
import Link from 'next/link';
import { FiMail, FiInstagram, FiClock, FiSend } from 'react-icons/fi';
import { submitContactForm } from '@/lib/api/contact';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.subject.trim().length < 3) {
            newErrors.subject = 'Subject must be at least 3 characters';
        }

        if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({}); // Clear any previous errors

        try {
            // Call real backend API
            const response = await submitContactForm(formData);

            setIsSubmitting(false);
            setSubmitSuccess(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Hide success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            setIsSubmitting(false);
            setErrors({
                submit: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="min-h-screen brand-bg relative pt-[var(--header-height)]">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-20 pt-8 sm:pt-12">

                {/* Page Header */}
                <div className="mb-10 sm:mb-12 text-center">
                    <h1 className="text-[22px] sm:text-[26px] md:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] brand-text-primary mb-3">
                        Get In Touch
                    </h1>
                    <p className="brand-text-muted text-[11px] sm:text-[12px] uppercase tracking-[0.22em]">
                        We'd love to hear from you
                    </p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-8 p-4 rounded-lg luxury-glass border border-green-500/30 bg-green-500/10">
                        <p className="text-green-400 text-center text-sm">
                            ✓ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                        </p>
                    </div>
                )}

                {/* Submit Error Message */}
                {errors.submit && (
                    <div className="mb-8 p-4 rounded-lg luxury-glass border border-red-500/30 bg-red-500/10" role="alert">
                        <p className="text-red-400 text-center text-sm">
                            {errors.submit}
                        </p>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Contact Form */}
                    <div className="luxury-glass rounded-2xl p-6 sm:p-8 border border-white/10">
                        <h2 className="text-[20px] sm:text-[24px] font-light uppercase tracking-[0.12em] brand-text-primary mb-6">
                            Send Us a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block brand-text-muted text-[11px] uppercase tracking-[0.18em] mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                    className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'}
                    text-white placeholder-white/30
                    focus:outline-none focus:border-white/30
                    transition-colors
                  `}
                                    placeholder="Your Name"
                                />
                                {errors.name && (
                                    <p id="name-error" role="alert" className="mt-1 text-red-400 text-xs">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block brand-text-muted text-[11px] uppercase tracking-[0.18em] mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                    className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'}
                    text-white placeholder-white/30
                    focus:outline-none focus:border-white/30
                    transition-colors
                  `}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p id="email-error" role="alert" className="mt-1 text-red-400 text-xs">{errors.email}</p>
                                )}
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label htmlFor="subject" className="block brand-text-muted text-[11px] uppercase tracking-[0.18em] mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!errors.subject}
                                    aria-describedby={errors.subject ? "subject-error" : undefined}
                                    className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border ${errors.subject ? 'border-red-500/50' : 'border-white/10'}
                    text-white placeholder-white/30
                    focus:outline-none focus:border-white/30
                    transition-colors
                  `}
                                    placeholder="How can we help?"
                                />
                                {errors.subject && (
                                    <p id="subject-error" role="alert" className="mt-1 text-red-400 text-xs">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block brand-text-muted text-[11px] uppercase tracking-[0.18em] mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!errors.message}
                                    aria-describedby={errors.message ? "message-error" : undefined}
                                    className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'}
                    text-white placeholder-white/30
                    focus:outline-none focus:border-white/30
                    transition-colors
                    resize-none
                  `}
                                    placeholder="Tell us more about your inquiry..."
                                />
                                {errors.message && (
                                    <p id="message-error" role="alert" className="mt-1 text-red-400 text-xs">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                aria-label={isSubmitting ? "Sending message" : "Send message"}
                                aria-busy={isSubmitting}
                                className={`
                  w-full py-4 rounded-lg
                  bg-white text-black
                  font-medium uppercase tracking-[0.18em] text-[13px]
                  transition-all duration-300
                  flex items-center justify-center gap-2
                  min-h-[48px]
                  ${isSubmitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    }
                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" role="status" aria-label="Loading" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FiSend size={16} aria-hidden="true" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Email */}
                        <div className="luxury-glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-white/5">
                                    <FiMail size={24} className="text-white/70" />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-medium uppercase tracking-[0.12em] text-white mb-2">
                                        Email Us
                                    </h3>
                                    <a
                                        href="mailto:support@humantee.com"
                                        className="brand-text-muted text-[13px] hover:text-white transition-colors"
                                    >
                                        support@humantee.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="luxury-glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-white/5">
                                    <FiClock size={24} className="text-white/70" />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-medium uppercase tracking-[0.12em] text-white mb-2">
                                        Business Hours
                                    </h3>
                                    <p className="brand-text-muted text-[13px]">
                                        Monday - Friday<br />
                                        9:00 AM - 6:00 PM IST
                                    </p>
                                    <p className="brand-text-muted text-[11px] mt-2 italic">
                                        We respond within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="luxury-glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-white/5">
                                    <FiInstagram size={24} className="text-white/70" />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-medium uppercase tracking-[0.12em] text-white mb-2">
                                        Follow Us
                                    </h3>
                                    <a
                                        href="https://www.instagram.com/humanteeofficial/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="brand-text-muted text-[13px] hover:text-white transition-colors"
                                    >
                                        @humanteeofficial
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="luxury-glass rounded-2xl p-6 border border-white/10">
                            <h3 className="text-[16px] font-medium uppercase tracking-[0.12em] text-white mb-3">
                                Quick Links
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    href="/terms-privacy"
                                    className="block brand-text-muted text-[13px] hover:text-white transition-colors"
                                >
                                    Terms & Privacy Policy
                                </Link>
                                <Link
                                    href="/shop"
                                    className="block brand-text-muted text-[13px] hover:text-white transition-colors"
                                >
                                    Shop Collection
                                </Link>
                                <Link
                                    href="/orders"
                                    className="block brand-text-muted text-[13px] hover:text-white transition-colors"
                                >
                                    Track Order
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
